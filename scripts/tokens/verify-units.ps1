<#
.SYNOPSIS
  Verifica, para cada token usado en calc(var(X) * 1px), si el CDN devuelve
  el valor CON unidad (se puede quitar el *1px) o SIN unidad (hay que dejarlo).

.DESCRIPTION
  El CDN encadena tokens via var(), asi que hay que resolver la cadena
  hasta llegar a un valor literal.
#>
$ErrorActionPreference = 'Stop'

$cdnPath = 'projects/crdx-components/src/lib/styles/tokens/vendor/credix-tokens.css'
$cdn = Get-Content -Raw $cdnPath

# ── Mapa variable CDN -> valor literal ────────────────────────────────────────
$values = @{}
foreach ($m in [regex]::Matches($cdn, '(--[a-zA-Z0-9_-]+)\s*:\s*([^;}]+)')) {
  $values[$m.Groups[1].Value] = $m.Groups[2].Value.Trim()
}

$types = @('dimension', 'color', 'string', 'typography', 'shadow', 'gradient')

function Resolve-Logical([string]$logicalName) {
  foreach ($t in $types) {
    $candidate = '--' + $t + '-' + $logicalName.Substring(2)
    if ($values.ContainsKey($candidate)) { return $candidate }
  }
  return $null
}

# Resuelve cadenas var(...) hasta un literal
function Resolve-Value([string]$varName, [int]$depth = 0) {
  if ($depth -gt 12 -or -not $values.ContainsKey($varName)) { return $null }
  $v = $values[$varName]
  $m = [regex]::Match($v, '^var\(\s*(--[a-zA-Z0-9_-]+)')
  if ($m.Success) { return Resolve-Value $m.Groups[1].Value ($depth + 1) }
  return $v
}

# ── Tokens usados con calc(var(X) * 1px) ──────────────────────────────────────
$files = Get-ChildItem -Recurse projects -Include *.css, *.scss |
  Where-Object { $_.FullName -notmatch 'styles[\\/]tokens[\\/]' }

$usedInCalc = @{}
foreach ($f in $files) {
  $c = Get-Content -Raw $f.FullName
  if ([string]::IsNullOrWhiteSpace($c)) { continue }
  foreach ($m in [regex]::Matches($c, 'calc\(var\(\s*(--[a-zA-Z0-9_-]+)[^)]*\)\s*\*\s*1px\)')) {
    $n = $m.Groups[1].Value
    if (-not $usedInCalc.ContainsKey($n)) { $usedInCalc[$n] = @() }
    if ($usedInCalc[$n] -notcontains $f.Name) { $usedInCalc[$n] += $f.Name }
  }
}

$withUnit = @(); $unitless = @(); $notFound = @()

foreach ($n in ($usedInCalc.Keys | Sort-Object)) {
  # el componente usa el nombre logico; puede tener prefijo --app-
  $probe = $n
  $target = Resolve-Logical $probe
  if (-not $target -and $probe.StartsWith('--app-')) {
    $probe = '--' + $probe.Substring('--app-'.Length)
    $target = Resolve-Logical $probe
  }

  if (-not $target) {
    $notFound += [PSCustomObject]@{ Token = $n; Files = ($usedInCalc[$n] -join ',') }
    continue
  }

  $literal = Resolve-Value $target
  if ($null -eq $literal) {
    $notFound += [PSCustomObject]@{ Token = $n; Files = ($usedInCalc[$n] -join ',') }
    continue
  }

  $row = [PSCustomObject]@{ Token = $n; Cdn = $target; Value = $literal; Files = ($usedInCalc[$n] -join ',') }
  if ($literal -match '^-?[\d.]+(px|rem|em|%)$') { $withUnit += $row }
  elseif ($literal -match '^-?[\d.]+$') { $unitless += $row }
  else { $withUnit += $row }  # colores, fuentes, shadows: no se multiplican por 1px igual
}

$out = @()
$out += "Tokens distintos usados con calc(var(X) * 1px): $($usedInCalc.Count)"
$out += ""
$out += "CON unidad en el CDN  -> quitar el *1px : $($withUnit.Count)"
$out += "SIN unidad en el CDN  -> DEJAR el *1px  : $($unitless.Count)"
$out += "No resueltos en el CDN                  : $($notFound.Count)"
$out += ""
$out += "=== SIN UNIDAD (NO tocar estos) ==="
foreach ($r in $unitless) { $out += ("  {0}`n      = {1}   [{2}]" -f $r.Token, $r.Value, $r.Files) }
$out += ""
$out += "=== NO RESUELTOS EN EL CDN (revisar a mano) ==="
foreach ($r in $notFound) { $out += ("  {0}   [{1}]" -f $r.Token, $r.Files) }
$out += ""
$out += "=== CON UNIDAD (muestra de 25) ==="
foreach ($r in ($withUnit | Select-Object -First 25)) { $out += ("  {0}`n      = {1}" -f $r.Token, $r.Value) }

$out | Out-File -Encoding utf8 units-verification.txt
Write-Output 'OK'
