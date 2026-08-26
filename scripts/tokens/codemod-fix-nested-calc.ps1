<#
.SYNOPSIS
  Corrige los calc(var(--X, var(--Y[, N])) * 1px) que el codemod principal no puede tocar.

.DESCRIPTION
  El patron con var() anidado en el fallback no matchea la regex del codemod principal
  (que usa [^()]*? para evitar ambiguedad). Este script cubre esos 13 casos en
  button.css e icon-button.css.

  Transformaciones:
    calc(var(--X, var(--Y)) * 1px)      -> var(--X, var(--Y))
    calc(var(--X, var(--Y, N)) * 1px)   -> var(--X, var(--Y, Npx))

.PARAMETER DryRun
  Muestra los cambios sin escribir archivos.
#>
[CmdletBinding()]
param([switch]$DryRun)

$ErrorActionPreference = 'Stop'
Set-Location (Split-Path (Split-Path $PSScriptRoot -Parent) -Parent)

$files = Get-ChildItem -Recurse projects -Include *.css, *.scss |
  Where-Object { $_.FullName -notmatch 'styles[\\/]tokens[\\/]' }

# calc( var( --outer , var( --inner [, N] ) ) * 1px )
$pattern = 'calc\(\s*var\(\s*(--[a-zA-Z0-9_-]+)\s*,\s*(var\(\s*--[a-zA-Z0-9_-]+(?:\s*,\s*-?\d+(?:\.\d+)?)?\s*\))\s*\)\s*\*\s*1px\s*\)'

$totalFiles   = 0
$totalChanges = 0
$report       = @()

foreach ($f in $files) {
  $content = Get-Content -Raw $f.FullName
  if ([string]::IsNullOrWhiteSpace($content)) { continue }

  $script:count = 0

  $newContent = [regex]::Replace($content, $pattern, {
    param($m)
    $script:count++

    $outer = $m.Groups[1].Value
    $inner = $m.Groups[2].Value

    # Si el var interno tiene fallback numerico, agregarle px
    $inner = [regex]::Replace($inner, '(,\s*)(-?\d+(?:\.\d+)?)(\s*\))\s*$', '$1$2px$3')

    return "var($outer, $inner)"
  })

  if ($script:count -gt 0) {
    $totalFiles++
    $totalChanges += $script:count
    $rel = $f.FullName.Replace((Get-Location).Path + '\', '')
    $report += "  $rel  -> $($script:count) cambios"

    if (-not $DryRun) {
      Set-Content -Path $f.FullName -Value $newContent -Encoding utf8 -NoNewline
    }
  }
}

Write-Host ''
if ($DryRun) { Write-Host '=== DRY RUN — no se escribio nada ===' -ForegroundColor Yellow }
else         { Write-Host '=== CAMBIOS APLICADOS ===' -ForegroundColor Green }

Write-Host ("Archivos modificados: {0}" -f $totalFiles)
Write-Host ("Casos corregidos:     {0}" -f $totalChanges)
Write-Host ''
foreach ($r in $report) { Write-Host $r }
