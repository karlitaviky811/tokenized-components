<#
.SYNOPSIS
  Elimina el patron calc(var(--token[, fallback]) * 1px), moviendo la unidad al fallback.

.DESCRIPTION
  El CDN devuelve los tokens de tipo 'dimension' CON unidad (40px en vez de 40).
  El `* 1px` era un workaround para el paquete npm, que los daba sin unidad.
  Mantenerlo produce calc(40px * 1px) -> declaracion invalida (el browser la descarta).

  Transformaciones:
    calc(var(--x) * 1px)          -> var(--x)
    calc(var(--x, 64) * 1px)      -> var(--x, 64px)        <- la unidad pasa al fallback
    calc(var(--x, 0.5) * 1px)     -> var(--x, 0.5px)
    calc(var(--x, 1000) * 1px)    -> var(--x, 1000px)

  Mover la unidad al fallback es imprescindible: 61 tokens todavia no existen
  en el CDN (ver scripts/tokens/verify-units.ps1) y dependen del fallback.
  Sin este paso, `height: 64` seria invalido y romperia header, listas y modales.

  Los fallbacks no numericos (colores, fuentes, otro var()) se dejan intactos
  y se reportan como omitidos para revision manual.

.PARAMETER DryRun
  Muestra los cambios sin escribir archivos.
#>
[CmdletBinding()]
param([switch]$DryRun)

$ErrorActionPreference = 'Stop'

$files = Get-ChildItem -Recurse projects -Include *.css, *.scss |
  Where-Object { $_.FullName -notmatch 'styles[\\/]tokens[\\/]' }

# calc( var( --nombre [, fallback] ) * 1px )
$pattern = 'calc\(\s*var\(\s*(--[a-zA-Z0-9_-]+)\s*(?:,\s*([^()]*?)\s*)?\)\s*\*\s*1px\s*\)'

$totalFiles = 0
$noFallback = 0
$numericFallback = 0
$skipped = @()
$report = @()

foreach ($f in $files) {
  $content = Get-Content -Raw $f.FullName
  if ([string]::IsNullOrWhiteSpace($content)) { continue }

  $script:fileChanges = 0
  $script:fileSkips = 0

  $newContent = [regex]::Replace($content, $pattern, {
    param($m)
    $name = $m.Groups[1].Value
    $hasFallback = $m.Groups[2].Success -and -not [string]::IsNullOrWhiteSpace($m.Groups[2].Value)

    if (-not $hasFallback) {
      $script:noFallback++
      $script:fileChanges++
      return "var($name)"
    }

    $fb = $m.Groups[2].Value.Trim()

    # Fallback numerico puro -> se le agrega px
    if ($fb -match '^-?\d+(\.\d+)?$') {
      $script:numericFallback++
      $script:fileChanges++
      return "var($name, ${fb}px)"
    }

    # Fallback ya con unidad -> solo se quita el calc
    if ($fb -match '^-?\d+(\.\d+)?(px|rem|em|%)$') {
      $script:numericFallback++
      $script:fileChanges++
      return "var($name, $fb)"
    }

    # Cualquier otra cosa (var anidado, color, keyword): no tocar
    $script:skipped += [PSCustomObject]@{ File = $f.Name; Token = $name; Fallback = $fb }
    $script:fileSkips++
    return $m.Value
  })

  if ($script:fileChanges -gt 0) {
    $totalFiles++
    $rel = $f.FullName.Replace((Get-Location).Path + '\', '')
    $suffix = if ($script:fileSkips -gt 0) { "  ($script:fileSkips omitidos)" } else { '' }
    $report += "$rel  -> $script:fileChanges cambios$suffix"

    if (-not $DryRun) {
      Set-Content -Path $f.FullName -Value $newContent -Encoding utf8 -NoNewline
    }
  }
}

Write-Host ''
if ($DryRun) { Write-Host '=== DRY RUN (no se escribio nada) ===' -ForegroundColor Yellow }
else { Write-Host '=== CAMBIOS APLICADOS ===' -ForegroundColor Green }

Write-Host ("Archivos modificados:            {0}" -f $totalFiles)
Write-Host ("Sin fallback  -> var(--x):       {0}" -f $noFallback)
Write-Host ("Con fallback  -> var(--x, Npx):  {0}" -f $numericFallback)
Write-Host ("Omitidos (fallback no numerico): {0}" -f $skipped.Count) -ForegroundColor $(if ($skipped.Count) { 'Yellow' } else { 'DarkGray' })
Write-Host ''
foreach ($r in $report) { Write-Host "  $r" }

if ($skipped.Count -gt 0) {
  Write-Host ''
  Write-Host 'Omitidos (revisar a mano):' -ForegroundColor Yellow
  foreach ($s in $skipped) { Write-Host ("  {0}: {1}  fallback= {2}" -f $s.File, $s.Token, $s.Fallback) }
}
