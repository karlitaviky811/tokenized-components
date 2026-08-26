$ErrorActionPreference = 'Stop'

function Get-VarNames([string]$content) {
  [regex]::Matches($content, '--[a-zA-Z0-9_-]+(?=\s*:)') |
    ForEach-Object { $_.Value } | Sort-Object -Unique
}

$cdn = Get-VarNames (Get-Content -Raw "$env:TEMP\styles.min.css")
$old = Get-VarNames (Get-Content -Raw 'node_modules/@tokens_variables_credix/tokenized-styles/dist/css/resolved-root.css')

$types = @('color','dimension','string','typography','shadow','gradient')

# Strip type prefix from CDN names -> logical name
$map = @{}
$collisions = @()
foreach ($v in $cdn) {
  $matched = $false
  foreach ($t in $types) {
    if ($v.StartsWith("--$t-")) {
      $logical = '--' + $v.Substring("--$t-".Length)
      if ($map.ContainsKey($logical)) { $collisions += "$logical <= $($map[$logical]) AND $v" }
      else { $map[$logical] = $v }
      $matched = $true
      break
    }
  }
  if (-not $matched) { $map[$v] = $v }
}

$out = @()
$out += "CDN total:          $($cdn.Count)"
$out += "OLD total:          $($old.Count)"
$out += "CDN logical unique: $($map.Count)"
$out += "COLLISIONS:         $($collisions.Count)"
if ($collisions.Count -gt 0) { $out += ($collisions | Select-Object -First 20) }

$missing = $old | Where-Object { -not $map.ContainsKey($_) }
$out += ""
$out += "OLD names with NO match in CDN: $($missing.Count)"
$out += ($missing | Select-Object -First 40)

$added = $map.Keys | Where-Object { $old -notcontains $_ }
$out += ""
$out += "NEW logical names not in OLD: $($added.Count)"
$out += ($added | Sort-Object | Select-Object -First 20)

$out | Out-File -Encoding utf8 token-analysis.txt
