<#
.SYNOPSIS
  Compara las variables del CDN vs el paquete npm (resolved-root.css).
  Genera un reporte con: coincidencias, solo en CDN, solo en npm, renombramientos probables.
#>
$ErrorActionPreference = 'Stop'

$cdnPath = 'projects/crdx-components/src/lib/styles/tokens/vendor/credix-tokens.css'
$npmPath = 'node_modules/@tokens_variables_credix/tokenized-styles/dist/css/resolved-root.css'

function Get-VarNames([string]$path) {
  $c = Get-Content -Raw $path
  [regex]::Matches($c, '(--[a-zA-Z0-9_-]+)\s*:') |
    ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
}

$cdn = Get-VarNames $cdnPath
$npm = Get-VarNames $npmPath

$types = @('color','dimension','string','typography','shadow','gradient')

# CDN: quitar prefijo de tipo para obtener nombre logico
$cdnLogical = @{}
foreach ($v in $cdn) {
  $matched = $false
  foreach ($t in $types) {
    if ($v.StartsWith("--$t-")) {
      $key = '--' + $v.Substring("--$t-".Length)
      if (-not $cdnLogical.ContainsKey($key)) { $cdnLogical[$key] = @() }
      $cdnLogical[$key] += $v
      $matched = $true; break
    }
  }
  if (-not $matched) {
    if (-not $cdnLogical.ContainsKey($v)) { $cdnLogical[$v] = @($v) }
  }
}

# npm ya son nombres logicos directamente
$npmSet = New-Object System.Collections.Generic.HashSet[string]
foreach ($n in $npm) { [void]$npmSet.Add($n) }

$cdnLogicalSet = New-Object System.Collections.Generic.HashSet[string]
foreach ($k in $cdnLogical.Keys) { [void]$cdnLogicalSet.Add($k) }

# Clasificar
$inBoth    = @($npm | Where-Object { $cdnLogicalSet.Contains($_) })
$onlyNpm   = @($npm | Where-Object { -not $cdnLogicalSet.Contains($_) })
$onlyCdn   = @($cdnLogical.Keys | Where-Object { -not $npmSet.Contains($_) } | Sort-Object)

# Intentar detectar renombramientos: tokens solo en npm que matchean parcialmente con solo en CDN
$renames = @()
foreach ($n in ($onlyNpm | Select-Object -First 100)) {
  # Quitar prefijos conocidos que cambiaron: --app- -> sin app, y viceversa
  $candidates = @()
  
  # npm tiene --app- y CDN no
  if ($n.StartsWith('--app-')) {
    $stripped = '--' + $n.Substring('--app-'.Length)
    if ($cdnLogicalSet.Contains($stripped)) { $candidates += $stripped }
  }
  
  # npm tiene sin prefix 'colors' y CDN agrega 'colors'
  if ($n -like '--colors-*') {
    $alt = $n -replace '^--colors-', '--colors-'
    # ya tiene colors, buscar variantes
  }
  
  # ultimo segmento igual (heuristico)
  $lastSeg = ($n -split '-' | Select-Object -Last 3) -join '-'
  if ($lastSeg.Length -gt 8) {
    $match = $onlyCdn | Where-Object { $_ -like "*$lastSeg" } | Select-Object -First 1
    if ($match) { $candidates += $match }
  }
  
  if ($candidates.Count -gt 0) {
    $renames += [PSCustomObject]@{ npm = $n; cdn = ($candidates | Select-Object -First 1) }
  }
}

$out = @()
$out += "============================================"
$out += "  DIFERENCIAS: CDN vs Paquete NPM"  
$out += "============================================"
$out += ""
$out += "CDN (raw variables):           $($cdn.Count)"
$out += "CDN (nombres logicos unicos):  $($cdnLogical.Count)"
$out += "NPM (resolved-root.css):       $($npm.Count)"
$out += ""
$out += "En ambos (match directo):      $($inBoth.Count)"
$out += "Solo en NPM:                   $($onlyNpm.Count)"
$out += "Solo en CDN:                   $($onlyCdn.Count)"
$out += "Renombramientos detectados:    $($renames.Count)"
$out += ""

$out += "--- SOLO EN NPM (primeros 60) ---"
foreach ($n in ($onlyNpm | Sort-Object | Select-Object -First 60)) { $out += "  $n" }

$out += ""
$out += "--- SOLO EN CDN (primeros 60) ---"
foreach ($n in ($onlyCdn | Select-Object -First 60)) { $out += "  $n" }

$out += ""
$out += "--- RENOMBRAMIENTOS PROBABLES ---"
foreach ($r in $renames) { $out += "  NPM: $($r.npm)"; $out += "  CDN: $($r.cdn)"; $out += "" }

# Valores distintos para tokens que existen en ambos
$out += ""
$out += "--- VALORES DISTINTOS (misma variable, distinto valor) ---"
$cdnContent = Get-Content -Raw $cdnPath
$npmContent = Get-Content -Raw $npmPath

function Get-VarValue([string]$content, [string]$varName) {
  $escaped = [regex]::Escape($varName)
  $m = [regex]::Match($content, "$escaped\s*:\s*([^;]+)")
  if ($m.Success) { $m.Groups[1].Value.Trim() } else { $null }
}

$diffValues = @()
$sample = $inBoth | Get-Random -Count ([Math]::Min(200, $inBoth.Count))
foreach ($name in $sample) {
  $npmVal = Get-VarValue $npmContent $name
  
  # En CDN buscar la version con prefijo
  $cdnName = $cdnLogical[$name] | Select-Object -First 1
  $cdnVal = Get-VarValue $cdnContent $cdnName
  
  if ($npmVal -and $cdnVal -and $npmVal -ne $cdnVal) {
    $diffValues += [PSCustomObject]@{ name = $name; npm = $npmVal; cdn = $cdnVal }
  }
}

$out += "  Muestra analizada: $($sample.Count) de $($inBoth.Count)"
$out += "  Con valor distinto: $($diffValues.Count)"
foreach ($d in ($diffValues | Select-Object -First 30)) {
  $out += "    $($d.name)"
  $out += "      NPM: $($d.npm)"
  $out += "      CDN: $($d.cdn)"
  $out += ""
}

$out | Out-File -Encoding utf8 token-diff-report.txt
Write-Output "OK - Reporte en token-diff-report.txt"
