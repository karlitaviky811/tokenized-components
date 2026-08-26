$ErrorActionPreference = 'Stop'
$cdn = Get-Content -Raw 'projects/crdx-components/src/lib/styles/tokens/vendor/credix-tokens.css'
$names = [regex]::Matches($cdn, '(--[a-zA-Z0-9_-]+)\s*:') |
  ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique

$out = @()

$out += '=== 1. pallete-scheme en el CDN ==='
$out += ($names | Where-Object { $_ -like '*pallete-scheme*' } | Select-Object -First 40)

$out += ''
$out += '=== 2. lists-wip / list en el CDN ==='
$hits = $names | Where-Object { $_ -like '*lists-wip*' }
$out += ("lists-wip encontrados: {0}" -f @($hits).Count)
$out += ($hits | Select-Object -First 20)
$out += '--- cualquier *list* ---'
$out += ($names | Where-Object { $_ -like '*-list-*' } | Select-Object -First 20)

$out += ''
$out += '=== 3. text-fields en el CDN (muestra) ==='
$out += ($names | Where-Object { $_ -like '*text-fields-filled-enabled*' } | Select-Object -First 15)

$out += ''
$out += '=== 4. schemes / outline ==='
$out += ($names | Where-Object { $_ -like '*schemes*' } | Select-Object -First 15)

$out | Out-File -Encoding utf8 probe-renames.txt
Write-Output 'OK'
