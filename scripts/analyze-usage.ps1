$ErrorActionPreference = 'Stop'

$types = @('color','dimension','string','typography','shadow','gradient')

# --- indice logico del CDN ---
$cdnRaw = [regex]::Matches((Get-Content -Raw "$env:TEMP\styles.min.css"), '--[a-zA-Z0-9_-]+(?=\s*:)') |
  ForEach-Object { $_.Value } | Sort-Object -Unique

$logical = @{}
foreach ($v in $cdnRaw) {
  $hit = $false
  foreach ($t in $types) {
    if ($v.StartsWith("--$t-")) {
      $key = '--' + $v.Substring("--$t-".Length)
      if (-not $logical.ContainsKey($key)) { $logical[$key] = @() }
      $logical[$key] += $v
      $hit = $true; break
    }
  }
  if (-not $hit -and -not $logical.ContainsKey($v)) { $logical[$v] = @($v) }
}

# --- tokens realmente referenciados por la libreria ---
$files = Get-ChildItem -Recurse -Path 'projects' -Include *.css,*.scss |
  Where-Object { $_.FullName -notmatch 'generated' }

$used = @{}
foreach ($f in $files) {
  $c = Get-Content -Raw $f.FullName
  if ([string]::IsNullOrWhiteSpace($c)) { continue }
  foreach ($m in [regex]::Matches($c, 'var\(\s*(--[a-zA-Z0-9_-]+)')) {
    $n = $m.Groups[1].Value
    if (-not $used.ContainsKey($n)) { $used[$n] = @() }
    if ($used[$n] -notcontains $f.Name) { $used[$n] += $f.Name }
  }
}

$resolved = @(); $viaApp = @(); $unresolved = @(); $matOwn = @()
foreach ($n in $used.Keys) {
  if ($n -like '--md-sys-*' -or $n -like '--mat-*' -or $n -like '--mdc-*') { $matOwn += $n; continue }
  if ($logical.ContainsKey($n)) { $resolved += $n; continue }
  if ($n -like '--app-*') {
    $s = '--' + $n.Substring('--app-'.Length)
    if ($logical.ContainsKey($s)) { $viaApp += $n; continue }
  }
  $unresolved += $n
}

$out = @()
$out += "Archivos escaneados:                          $($files.Count)"
$out += "Tokens distintos usados por la libreria:      $($used.Count)"
$out += ""
$out += "RESUELVEN quitando prefijo de tipo:           $($resolved.Count)"
$out += "RESUELVEN si tambien se quita '--app-':       $($viaApp.Count)"
$out += "Propios de Material (--md-sys/--mat/--mdc):   $($matOwn.Count)"
$out += "NO RESUELVEN (requieren decision):            $($unresolved.Count)"
$out += ""
$out += "--- NO RESUELVEN (detalle: token [archivos]) ---"
foreach ($n in ($unresolved | Sort-Object)) {
  $out += ("{0}   [{1}]" -f $n, ($used[$n] -join ','))
}
$out += ""
$out += "--- COLISIONES de tipo (mismo nombre logico en 2+ tipos) ---"
foreach ($k in ($logical.Keys | Sort-Object)) {
  if ($logical[$k].Count -gt 1) { $out += ("{0}  ->  {1}" -f $k, ($logical[$k] -join ' | ')) }
}

$out | Out-File -Encoding utf8 usage-analysis.txt
Write-Output 'OK'
