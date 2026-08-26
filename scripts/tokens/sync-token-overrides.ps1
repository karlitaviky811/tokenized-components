<#
.SYNOPSIS
  Genera token-overrides.css corrigiendo los tokens SUSPECT del CDN.

.DESCRIPTION
  El CDN clasifica incorrectamente ciertos tokens como 'dimension' y les agrega
  la unidad 'px' a valores que deben ser numeros puros:
    - opacity:      el CDN da '38px', debe ser '38'  (entero 0-100)
    - font-weight:  el CDN da '400px', debe ser '400' (entero 100-900)

  El archivo generado debe cargarse DESPUES de credix-tokens.css y ANTES de
  token-aliases.css para que las sobreescrituras surtan efecto en la cascada.

  Ejecutar cada vez que se descargue una nueva version del CDN.
#>

$ErrorActionPreference = 'Stop'
Set-Location (Split-Path (Split-Path $PSScriptRoot -Parent) -Parent)

$vendorFile  = 'projects/crdx-components/src/lib/styles/tokens/vendor/credix-tokens.css'
$outputFile  = 'projects/crdx-components/src/lib/styles/tokens/token-overrides.css'

$css = Get-Content -Raw $vendorFile

# Busca --dimension-* tokens cuyo valor es un entero seguido de 'px'
# Solo los que semanticamente no deben tener unidad (opacity, font-weight)
$allMatches = [regex]::Matches($css, '--(dimension-[a-zA-Z0-9_-]+):(\d+(?:\.\d+)?)px')

$suspects = @()
foreach ($m in $allMatches) {
    $name  = $m.Groups[1].Value
    $value = $m.Groups[2].Value

    if ($name -match 'opacity' -or $name -match 'font-weight') {
        $suspects += [PSCustomObject]@{ Token = "--$name"; Value = $value }
    }
}

$suspects = $suspects | Sort-Object Token -Unique

Write-Host ("Tokens SUSPECT encontrados: {0}" -f $suspects.Count)

if ($suspects.Count -eq 0) {
    Write-Host 'Nada que corregir — token-overrides.css no se genera.' -ForegroundColor Green
    exit 0
}

$lines = @()
$lines += "/**"
$lines += " * token-overrides.css - AUTO-GENERADO por scripts/tokens/sync-token-overrides.ps1"
$lines += " *"
$lines += " * Corrige tokens SUSPECT del CDN: valores numericos a los que el CDN agrego"
$lines += " * incorrectamente la unidad px (opacity, font-weight)."
$lines += " *"
$lines += " * Orden de carga (angular.json):"
$lines += " *   1. credix-tokens.css   (CDN - fuente original, contiene los valores erroneos)"
$lines += " *   2. token-overrides.css (este archivo - sobreescribe los SUSPECT)"
$lines += " *   3. token-aliases.css   (bridge - mapea nombres logicos a tokens CDN)"
$lines += " *"
$lines += " * NO editar a mano. Re-ejecutar el script tras actualizar el CDN."
$lines += " */"
$lines += ""
$lines += ":root {"

foreach ($s in $suspects) {
    $lines += ("  {0}: {1};" -f $s.Token, $s.Value)
}

$lines += "}"
$lines += ""

$content = $lines -join "`n"
Set-Content -Path $outputFile -Value $content -Encoding utf8 -NoNewline

Write-Host ("Archivo generado: {0}" -f $outputFile) -ForegroundColor Green
Write-Host ("  {0} tokens corregidos" -f $suspects.Count)
