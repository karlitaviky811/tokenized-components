$ErrorActionPreference = 'Stop'

$files = Get-ChildItem -Recurse projects -Include *.css, *.scss |
  Where-Object { $_.FullName -notmatch 'styles[\\/]tokens[\\/]' }

$out = @()
$out += '=== USO DE TOKENS *-opacity ==='
foreach ($f in $files) {
  $lines = Get-Content $f.FullName -ErrorAction SilentlyContinue
  if (-not $lines) { continue }
  for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match 'var\(\s*--[a-zA-Z0-9_-]*opacity') {
      $out += ("  {0}:{1}  {2}" -f $f.Name, ($i + 1), $lines[$i].Trim())
    }
  }
}

$out += ''
$out += '=== USO DE TOKENS *-weight ==='
$c = 0
foreach ($f in $files) {
  $lines = Get-Content $f.FullName -ErrorAction SilentlyContinue
  if (-not $lines) { continue }
  for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match 'var\(\s*--[a-zA-Z0-9_-]*weight' -and $c -lt 25) {
      $out += ("  {0}:{1}  {2}" -f $f.Name, ($i + 1), $lines[$i].Trim())
      $c++
    }
  }
}

$out += ''
$out += '=== USO DE TOKENS *elevation* ==='
foreach ($f in $files) {
  $lines = Get-Content $f.FullName -ErrorAction SilentlyContinue
  if (-not $lines) { continue }
  for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match 'var\(\s*--[a-zA-Z0-9_-]*elevation') {
      $out += ("  {0}:{1}  {2}" -f $f.Name, ($i + 1), $lines[$i].Trim())
    }
  }
}

$out | Out-File -Encoding utf8 probe-usage-context.txt
Write-Output 'OK'
