<#
.SYNOPSIS
  Sincroniza los design tokens de Credix desde el CDN y genera la capa de alias.

.DESCRIPTION
  El CDN publica los tokens en un unico :root con el nombre prefijado por su tipo
  primitivo (--color-, --dimension-, --string-, --typography-, --shadow-, --gradient-).
  La libreria, en cambio, consume los nombres SIN ese prefijo (y algunos con --app-).

  Este script:
    1. Descarga el CSS del CDN a un archivo versionado (vendor/) + lock con SHA256.
    2. Genera una capa de alias que mapea el nombre logico -> variable del CDN.

  El prefijo de tipo NO es derivable del nombre logico
  (ej: label-text-weight es 'dimension' pero label-text-font es 'string'),
  por eso el mapeo se genera SIEMPRE a partir del CDN, que es la fuente de verdad.

.PARAMETER Url
  URL del CSS de tokens. Default: el blob publico de Credix.

.PARAMETER OnlyUsed
  Emite alias unicamente para los tokens que la libreria referencia via var().
  Reduce el tamano, pero rompe a consumidores que usen tokens no referenciados aca.

.PARAMETER AllAppAliases
  Emite el alias con prefijo --app- para TODOS los nombres logicos.
  Por defecto solo se emiten los --app-* que la libreria realmente consume:
  ese prefijo es una convencion local del repo (generated/_app-tokens.scss),
  no parte del contrato del CDN, y emitirlo completo duplica el archivo.

.PARAMETER SkipDownload
  Regenera los alias desde el archivo ya vendorizado, sin salir a la red.

.EXAMPLE
  pwsh -File scripts/tokens/sync-tokens.ps1
  pwsh -File scripts/tokens/sync-tokens.ps1 -SkipDownload
#>
[CmdletBinding()]
param(
  [string]$Url = 'https://4pgkhwcphxlnvvjb.public.blob.vercel-storage.com/styles2.min.css',
  [switch]$OnlyUsed,
  [switch]$AllAppAliases,
  [switch]$SkipDownload
)

$ErrorActionPreference = 'Stop'

# ── Rutas ─────────────────────────────────────────────────────────────────────
$repoRoot   = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$tokensDir  = Join-Path $repoRoot 'projects/crdx-components/src/lib/styles/tokens'
$vendorDir  = Join-Path $tokensDir 'vendor'
$vendorCss  = Join-Path $vendorDir 'credix-tokens.css'
$lockFile   = Join-Path $vendorDir 'credix-tokens.lock.json'
$aliasCss   = Join-Path $tokensDir 'token-aliases.css'

New-Item -ItemType Directory -Force -Path $vendorDir | Out-Null

# Orden de preferencia cuando un nombre logico existe en mas de un tipo.
# 'dimension' primero: --elevation-N se usa como valor numerico en la libreria.
$typePreference = @('dimension', 'color', 'string', 'typography', 'shadow', 'gradient')

# ── 1. Descarga versionada ────────────────────────────────────────────────────
if ($SkipDownload) {
  if (-not (Test-Path $vendorCss)) { throw "No existe $vendorCss. Corre sin -SkipDownload." }
  Write-Host "[skip] Usando vendor existente: $vendorCss" -ForegroundColor Yellow
}
else {
  Write-Host "[1/3] Descargando tokens desde el CDN..." -ForegroundColor Cyan
  $tmp = Join-Path ([IO.Path]::GetTempPath()) "credix-tokens-$([guid]::NewGuid()).css"
  try {
    Invoke-WebRequest -Uri $Url -OutFile $tmp -UseBasicParsing -ErrorAction Stop
  }
  catch {
    if (Test-Path $vendorCss) {
      Write-Warning "Descarga fallida ($($_.Exception.Message)). Continuo con el vendor existente."
      $tmp = $null
    }
    else { throw "Descarga fallida y no hay vendor local previo: $($_.Exception.Message)" }
  }

  if ($tmp) {
    $newHash = (Get-FileHash $tmp -Algorithm SHA256).Hash
    $oldHash = if (Test-Path $lockFile) { (Get-Content -Raw $lockFile | ConvertFrom-Json).sha256 } else { $null }

    if ($oldHash -eq $newHash) {
      Write-Host "      Sin cambios (SHA256 $($newHash.Substring(0,12))...)" -ForegroundColor DarkGray
    }
    else {
      $from = if ($oldHash) { $oldHash.Substring(0, 12) } else { 'nuevo' }
      Write-Host "      Tokens actualizados: $from -> $($newHash.Substring(0,12))" -ForegroundColor Green
    }
    Move-Item -Force $tmp $vendorCss
  }
}

$vendorContent = Get-Content -Raw $vendorCss
if ([string]::IsNullOrWhiteSpace($vendorContent)) { throw "El CSS vendorizado esta vacio: $vendorCss" }

# ── 2. Indexar el CDN: nombre logico -> variable prefijada ────────────────────
Write-Host "[2/3] Indexando tokens del CDN..." -ForegroundColor Cyan

$cdnVars = [regex]::Matches($vendorContent, '(--[a-zA-Z0-9_-]+)\s*:') |
  ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique

$logical   = @{}   # nombre logico -> hashtable{ tipo -> variable CDN }
$untyped   = New-Object System.Collections.Generic.HashSet[string]

foreach ($v in $cdnVars) {
  $matchedType = $null
  foreach ($t in $typePreference) {
    if ($v.StartsWith("--$t-")) { $matchedType = $t; break }
  }
  if (-not $matchedType) { [void]$untyped.Add($v); continue }

  $key = '--' + $v.Substring("--$matchedType-".Length)
  if (-not $logical.ContainsKey($key)) { $logical[$key] = @{} }
  $logical[$key][$matchedType] = $v
}

$collisions = @($logical.GetEnumerator() | Where-Object { $_.Value.Count -gt 1 })

Write-Host "      Variables en el CDN:   $($cdnVars.Count)"
Write-Host "      Nombres logicos:       $($logical.Count)"
Write-Host "      Sin prefijo de tipo:   $($untyped.Count)"
Write-Host "      Colisiones de tipo:    $($collisions.Count)" -ForegroundColor $(if ($collisions.Count) { 'Yellow' } else { 'DarkGray' })
foreach ($c in $collisions) {
  $winner = $typePreference | Where-Object { $c.Value.ContainsKey($_) } | Select-Object -First 1
  Write-Host "        $($c.Key) -> gana '$winner' (opciones: $($c.Value.Keys -join ', '))" -ForegroundColor Yellow
}

# ── 3. Tokens efectivamente usados por la libreria ────────────────────────────
# Se escanea siempre: define el alcance de los alias --app-* y habilita -OnlyUsed.
$usedNames = New-Object System.Collections.Generic.HashSet[string]
$styleFiles = Get-ChildItem -Recurse -Path (Join-Path $repoRoot 'projects') -Include *.css, *.scss |
  Where-Object { $_.FullName -notmatch 'styles[\\/]tokens[\\/]' }
foreach ($f in $styleFiles) {
  $c = Get-Content -Raw $f.FullName
  if ([string]::IsNullOrWhiteSpace($c)) { continue }
  foreach ($m in [regex]::Matches($c, 'var\(\s*(--[a-zA-Z0-9_-]+)')) {
    [void]$usedNames.Add($m.Groups[1].Value)
  }
}
Write-Host "      Tokens usados por la lib: $($usedNames.Count)" -ForegroundColor DarkGray

# ── 4. Generar la capa de alias ───────────────────────────────────────────────
Write-Host "[3/3] Generando capa de alias..." -ForegroundColor Cyan

$sb = New-Object System.Text.StringBuilder
[void]$sb.AppendLine('/**')
[void]$sb.AppendLine(' * ARCHIVO GENERADO - NO EDITAR A MANO.')
[void]$sb.AppendLine(' * Regenerar con: pwsh -File scripts/tokens/sync-tokens.ps1')
[void]$sb.AppendLine(' *')
[void]$sb.AppendLine(' * Mapea los nombres logicos que consume la libreria hacia las variables')
[void]$sb.AppendLine(' * del CDN, que vienen prefijadas por tipo primitivo.')
[void]$sb.AppendLine(" * Fuente: $Url")
[void]$sb.AppendLine(' */')
[void]$sb.AppendLine(':root {')

$emittedPlain = 0
$emittedApp   = 0

foreach ($key in ($logical.Keys | Sort-Object)) {
  $byType = $logical[$key]
  $type   = $typePreference | Where-Object { $byType.ContainsKey($_) } | Select-Object -First 1
  $target = $byType[$type]

  $appKey = '--app-' + $key.Substring(2)

  # Alias logico: completo por defecto (capa de compatibilidad con el paquete npm).
  if (-not $OnlyUsed -or $usedNames.Contains($key)) {
    [void]$sb.AppendLine("  $key`: var($target);")
    $emittedPlain++
  }

  # Alias --app-*: solo los que la libreria consume, salvo -AllAppAliases.
  $wantApp = if ($AllAppAliases -and -not $OnlyUsed) { $true } else { $usedNames.Contains($appKey) }
  if ($wantApp) {
    [void]$sb.AppendLine("  $appKey`: var($target);")
    $emittedApp++
  }
}

[void]$sb.AppendLine('}')
$aliasText = $sb.ToString()
Set-Content -Path $aliasCss -Value $aliasText -Encoding utf8 -NoNewline

# ── 4b. Variante en rem ───────────────────────────────────────────────────────
# Se regenera aca para que el derivado nunca quede desfasado del vendor.
# El build consume credix-tokens.rem.css, no el original.
Write-Host "[3.5/3] Generando variante en rem..." -ForegroundColor Cyan
& (Join-Path $PSScriptRoot 'build-rem-tokens.ps1')

# ── 5. Lock file ──────────────────────────────────────────────────────────────
$aliasMode = if ($OnlyUsed) { 'only-used' } elseif ($AllAppAliases) { 'full+all-app' } else { 'full+app-used' }

$lock = [ordered]@{
  url              = $Url
  sha256           = (Get-FileHash $vendorCss -Algorithm SHA256).Hash
  syncedAt         = (Get-Date).ToUniversalTime().ToString('o')
  vendorBytes      = (Get-Item $vendorCss).Length
  cdnVariables     = $cdnVars.Count
  logicalNames     = $logical.Count
  untypedVariables = $untyped.Count
  typeCollisions   = $collisions.Count
  aliasMode        = $aliasMode
  aliasPlain       = $emittedPlain
  aliasAppPrefixed = $emittedApp
  aliasBytes       = (Get-Item $aliasCss).Length
}
$lock | ConvertTo-Json -Depth 3 | Set-Content -Path $lockFile -Encoding utf8

# ── Resumen ───────────────────────────────────────────────────────────────────
function Get-GzipSize([string]$text) {
  $bytes = [Text.Encoding]::UTF8.GetBytes($text)
  $ms = New-Object IO.MemoryStream
  $gz = New-Object IO.Compression.GZipStream($ms, [IO.Compression.CompressionLevel]::Optimal)
  $gz.Write($bytes, 0, $bytes.Length); $gz.Close()
  $ms.ToArray().Length
}

Write-Host ''
Write-Host 'Listo.' -ForegroundColor Green
Write-Host ("  vendor : {0,10:N0} B  (gz {1,7:N0} B)  {2}" -f $lock.vendorBytes, (Get-GzipSize $vendorContent), 'credix-tokens.css')
Write-Host ("  alias  : {0,10:N0} B  (gz {1,7:N0} B)  {2} declaraciones" -f $lock.aliasBytes, (Get-GzipSize $aliasText), ($emittedPlain + $emittedApp))
Write-Host ("  lock   : {0}" -f (Resolve-Path $lockFile -Relative))
