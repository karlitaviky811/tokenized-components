<#
.SYNOPSIS
  Reescribe los nombres de tokens que el CDN renombro respecto al paquete npm.

.DESCRIPTION
  El CDN cambio tres grupos de nombres logicos:

  GRUPO 1 — list-list-item -> list-item
    El CDN quito un segmento 'list-' del path de listas.
    Afecta: _mat-list-overrides.scss, list-item.css

  GRUPO 2 — --bars-common/size -> --app-bars-common/size
    El CDN agrego el prefijo 'app-bars-' a los tokens de header.
    Afecta: header.css

  GRUPO 3 — --pallete-scheme-X-X -> --pallete-scheme-X
    El CDN quito el segmento repetido al final del nombre.
    Afecta: _md3-tokens.scss, _mat-table-overrides.scss

  Todos los reemplazos son mecanicos y se pueden verificar con -DryRun.

.PARAMETER DryRun
  Muestra los cambios sin escribir ningun archivo.

.PARAMETER Group
  Ejecuta solo un grupo: 1, 2 o 3. Por defecto ejecuta los tres.

.EXAMPLE
  pwsh -File scripts/tokens/codemod-rename-tokens.ps1 -DryRun
  pwsh -File scripts/tokens/codemod-rename-tokens.ps1
  pwsh -File scripts/tokens/codemod-rename-tokens.ps1 -Group 1 -DryRun
#>
[CmdletBinding()]
param(
  [switch]$DryRun,
  [ValidateSet('1', '2', '3', '')]
  [string]$Group = ''
)

$ErrorActionPreference = 'Stop'

$repoRoot  = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$projRoot  = Join-Path $repoRoot 'projects'

# ── helpers ───────────────────────────────────────────────────────────────────

function Get-StyleFiles {
  Get-ChildItem -Recurse $projRoot -Include *.css, *.scss |
    Where-Object { $_.FullName -notmatch 'styles[\\/]tokens[\\/]' }
}

function Write-Match([string]$label, [string]$before, [string]$after, [string]$file) {
  Write-Host "  [$label]" -ForegroundColor DarkGray -NoNewline
  Write-Host " $file"
  Write-Host "    - $before" -ForegroundColor Red
  Write-Host "    + $after" -ForegroundColor Green
}

$totalFiles   = 0
$totalChanges = 0
$report       = [System.Collections.Generic.List[string]]::new()

function Apply-Group([int]$id, [string]$desc, [scriptblock]$transform) {
  if ($Group -ne '' -and $Group -ne "$id") { return }

  Write-Host ''
  Write-Host "=== GRUPO ${id}: $desc ===" -ForegroundColor Cyan

  $groupFiles   = 0
  $groupChanges = 0

  foreach ($f in (Get-StyleFiles)) {
    $original = Get-Content -Raw $f.FullName
    if ([string]::IsNullOrWhiteSpace($original)) { continue }

    $result = & $transform $original $f.Name
    if ($result -ceq $original) { continue }

    # Contar cambios (lineas que difieren)
    $oldLines = $original -split "`n"
    $newLines = $result   -split "`n"
    $changed  = 0
    for ($i = 0; $i -lt [Math]::Max($oldLines.Count, $newLines.Count); $i++) {
      if ($oldLines[$i] -cne $newLines[$i]) { $changed++ }
    }

    $rel = $f.FullName.Replace($repoRoot + '\', '')
    $report.Add("  Grupo $id | $rel  ($changed lineas)")
    $groupFiles++
    $groupChanges += $changed
    $script:totalFiles++
    $script:totalChanges += $changed

    if (-not $DryRun) {
      Set-Content -Path $f.FullName -Value $result -Encoding utf8 -NoNewline
    }
  }

  $status = if ($groupFiles -eq 0) { 'sin cambios' } else { "$groupFiles archivo(s), $groupChanges linea(s)" }
  Write-Host "  -> $status" -ForegroundColor $(if ($groupFiles -gt 0) { 'Green' } else { 'DarkGray' })
}

# ── GRUPO 1: list-list-item -> list-item ──────────────────────────────────────
# npm: --app-lists-wip-common-*-list-list-item-*
# CDN: --app-lists-wip-common-*-list-item-*  (un segmento 'list-' menos)
#
# La regex es segura: 'list-list-item' no aparece en ningun nombre que no sea
# este patron especifico. Se aplica en todo el archivo, no solo en var().

Apply-Group 1 'list-list-item -> list-item' {
  param([string]$content, [string]$fname)
  $content -replace '-list-list-item-', '-list-item-'
}

# ── GRUPO 2: --bars-common/size -> --app-bars-common/size ────────────────────
# npm: var(--bars-common-app-bar-*)  var(--bars-size-*)
# CDN: var(--app-bars-common-app-bar-*)  var(--app-bars-size-*)
#
# Solo dentro de var() para no tocar comentarios ni selectores.
# '--bars-brand-*' no existe en CDN tampoco, pero se reporta como omitido
# porque el patron no coincide (esos tokens son MISSING, no renombrados).

Apply-Group 2 '--bars-common/size -> --app-bars-common/size' {
  param([string]$content, [string]$fname)
  $content `
    -replace '(var\(\s*)--bars-common-', '$1--app-bars-common-' `
    -replace '(var\(\s*)--bars-size-',   '$1--app-bars-size-'
}

# ── GRUPO 3: --pallete-scheme-X-X -> --pallete-scheme-X ──────────────────────
# npm usaba el segmento final repetido:
#   --pallete-scheme-error-error          -> --pallete-scheme-error
#   --pallete-scheme-primary-primary      -> --pallete-scheme-primary
#   --pallete-scheme-surface-surface      -> --pallete-scheme-surface
#   --pallete-scheme-surface-surface-*    -> --pallete-scheme-surface-*
#
# Orden: primero el patron con continuacion (surface-surface-X), luego el doble puro.
# Asi evitamos que 'surface-surface' matchee antes de 'surface-surface-container'.

Apply-Group 3 '--pallete-scheme-X-X -> --pallete-scheme-X' {
  param([string]$content, [string]$fname)
  $content `
    -replace '--pallete-scheme-surface-surface-(bright|container|dim)', '--pallete-scheme-surface-$1' `
    -replace '--pallete-scheme-surface-surface-container-(high|low)(est)?', '--pallete-scheme-surface-container-$1$2' `
    -replace '--pallete-scheme-surface-surface\b', '--pallete-scheme-surface' `
    -replace '--pallete-scheme-(error|information|link|primary|secondary|success|tertiary|warning)-\1\b', '--pallete-scheme-$1'
}

# ── resumen ───────────────────────────────────────────────────────────────────

Write-Host ''
if ($DryRun) {
  Write-Host '=== DRY RUN — no se escribio nada ===' -ForegroundColor Yellow
} else {
  Write-Host '=== CAMBIOS APLICADOS ===' -ForegroundColor Green
}

Write-Host ("Archivos modificados: {0}" -f $totalFiles)
Write-Host ("Lineas cambiadas:     {0}" -f $totalChanges)
Write-Host ''
foreach ($r in $report) { Write-Host $r }

if ($totalFiles -eq 0) {
  Write-Host '  (ninguno — puede que ya se haya ejecutado antes)' -ForegroundColor DarkGray
}
