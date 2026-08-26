<#
.SYNOPSIS
  Auditoria componente por componente: que token usa cada archivo, como se llama
  en el CDN, que valor resuelve y si el valor es coherente con su uso.

.DESCRIPTION
  Estados reportados:
    OK        -> existe en el CDN y el valor parece coherente
    MISSING   -> el componente lo usa pero el CDN no lo publica
    SUSPECT   -> existe, pero el valor tiene unidad incoherente
                 (opacity / elevation / weight / z-index con px)
    LOCAL     -> variable local del componente, no es token de diseno
    MATERIAL  -> variable propia de Angular Material (--mat / --mdc / --md-sys)
#>
$ErrorActionPreference = 'Stop'

$cdnPath = 'projects/crdx-components/src/lib/styles/tokens/vendor/credix-tokens.css'
$cdn = Get-Content -Raw $cdnPath

# ── valores del CDN ───────────────────────────────────────────────────────────
$values = @{}
foreach ($m in [regex]::Matches($cdn, '(--[a-zA-Z0-9_-]+)\s*:\s*([^;}]+)')) {
  $values[$m.Groups[1].Value] = $m.Groups[2].Value.Trim()
}

$types = @('dimension', 'color', 'string', 'typography', 'shadow', 'gradient')

function Find-CdnVar([string]$logical) {
  foreach ($t in $types) {
    $c = '--' + $t + '-' + $logical.Substring(2)
    if ($values.ContainsKey($c)) { return $c }
  }
  return $null
}

function Resolve-Literal([string]$varName, [int]$d = 0) {
  if ($d -gt 12 -or -not $values.ContainsKey($varName)) { return $null }
  $v = $values[$varName]
  $m = [regex]::Match($v, '^var\(\s*(--[a-zA-Z0-9_-]+)')
  if ($m.Success) { return Resolve-Literal $m.Groups[1].Value ($d + 1) }
  return $v
}

# nombres cuyo valor NO deberia llevar unidad de longitud
$unitlessSemantics = 'opacity|elevation|weight|z-index|ratio|count'

# ── recorrer componentes ──────────────────────────────────────────────────────
$files = Get-ChildItem -Recurse projects -Include *.css, *.scss |
  Where-Object { $_.FullName -notmatch 'styles[\\/]tokens[\\/]' } |
  Sort-Object FullName

$rows = @()

foreach ($f in $files) {
  $c = Get-Content -Raw $f.FullName
  if ([string]::IsNullOrWhiteSpace($c)) { continue }

  # variables definidas en este mismo archivo -> locales
  $localDefs = New-Object System.Collections.Generic.HashSet[string]
  foreach ($m in [regex]::Matches($c, '(?m)^\s*(--[a-zA-Z0-9_-]+)\s*:')) {
    [void]$localDefs.Add($m.Groups[1].Value)
  }

  $used = [regex]::Matches($c, 'var\(\s*(--[a-zA-Z0-9_-]+)') |
    ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique

  foreach ($n in $used) {
    if ($n -match '^--(mat|mdc|md-sys)-') {
      $rows += [PSCustomObject]@{ File = $f.Name; Token = $n; Status = 'MATERIAL'; CdnVar = ''; Value = '' }
      continue
    }
    if ($localDefs.Contains($n)) {
      $rows += [PSCustomObject]@{ File = $f.Name; Token = $n; Status = 'LOCAL'; CdnVar = ''; Value = '' }
      continue
    }

    $probe = $n
    $cdnVar = Find-CdnVar $probe
    if (-not $cdnVar -and $probe.StartsWith('--app-')) {
      $probe = '--' + $probe.Substring('--app-'.Length)
      $cdnVar = Find-CdnVar $probe
    }

    if (-not $cdnVar) {
      $rows += [PSCustomObject]@{ File = $f.Name; Token = $n; Status = 'MISSING'; CdnVar = ''; Value = '' }
      continue
    }

    $lit = Resolve-Literal $cdnVar
    $status = 'OK'
    if ($n -match $unitlessSemantics -and $lit -match '^-?[\d.]+(px|rem|em)$') { $status = 'SUSPECT' }

    $rows += [PSCustomObject]@{ File = $f.Name; Token = $n; Status = $status; CdnVar = $cdnVar; Value = $lit }
  }
}

# ── reporte ───────────────────────────────────────────────────────────────────
$out = @()
$out += '================================================================'
$out += '  AUDITORIA DE TOKENS POR COMPONENTE'
$out += '================================================================'
$out += ''

$byStatus = $rows | Group-Object Status | Sort-Object Name
foreach ($g in $byStatus) { $out += ("{0,-10} {1}" -f $g.Name, $g.Count) }
$out += ''

$out += '=== SUSPECT: valor con unidad incoherente (px en opacity/elevation/weight) ==='
$suspects = @($rows | Where-Object { $_.Status -eq 'SUSPECT' })
$out += ("Total: {0}  |  tokens distintos: {1}" -f $suspects.Count, (@($suspects | Select-Object -ExpandProperty Token -Unique)).Count)
$out += ''
foreach ($s in ($suspects | Sort-Object Token -Unique)) {
  $out += ("  {0}" -f $s.Token)
  $out += ("      CDN: {0} = {1}" -f $s.CdnVar, $s.Value)
}
$out += ''

$out += '=== MISSING por componente (el CDN no publica estos) ==='
$missingByFile = $rows | Where-Object { $_.Status -eq 'MISSING' } | Group-Object File | Sort-Object Name
foreach ($g in $missingByFile) {
  $out += ("  {0}  ({1})" -f $g.Name, $g.Count)
  foreach ($r in ($g.Group | Sort-Object Token)) { $out += ("      {0}" -f $r.Token) }
  $out += ''
}

$out += '=== DETALLE POR COMPONENTE (solo tokens de diseno) ==='
$byFile = $rows | Where-Object { $_.Status -in @('OK', 'SUSPECT', 'MISSING') } |
  Group-Object File | Sort-Object Name
foreach ($g in $byFile) {
  $ok = @($g.Group | Where-Object { $_.Status -eq 'OK' }).Count
  $su = @($g.Group | Where-Object { $_.Status -eq 'SUSPECT' }).Count
  $mi = @($g.Group | Where-Object { $_.Status -eq 'MISSING' }).Count
  $out += ("{0,-42} OK:{1,-4} SUSPECT:{2,-4} MISSING:{3}" -f $g.Name, $ok, $su, $mi)
}

$out | Out-File -Encoding utf8 audit-by-component.txt
Write-Output 'OK'
