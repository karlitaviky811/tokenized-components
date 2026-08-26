<#
.SYNOPSIS
  Genera una variante en rem del CSS de tokens vendorizado del CDN.

.DESCRIPTION
  El CDN publica los tokens de dimension en px. Esta capa derivada convierte
  esos literales a rem para que los componentes escalen con el font-size raiz.

  Se transforma el archivo vendorizado (los literales) y NO la capa de alias:
  el alias es una indireccion pura (--token: var(--dimension-token)) y CSS no
  puede quitarle la unidad a un valor, asi que calc(var(--x) / 16 * 1rem) es
  invalido. Manteniendo la indireccion intacta, un MFE consumidor puede seguir
  sobreescribiendo las variables --dimension-* del CDN.

  El vendor original queda como fuente de verdad auditable; este archivo es un
  derivado regenerable y diffeable contra el.

.PARAMETER RootFontSize
  Font-size raiz asumido para la conversion. Default 16.

.PARAMETER VendorCss
  Ruta al CSS vendorizado. Default: el del repo.

.NOTES
  Exclusiones (se dejan en px a proposito):

    - Grosores de linea (outline-width, border-width, indicator-thickness,
      indicator-weight): un borde es un detalle de renderizado, no una medida
      de escala. En rem, 0.0625rem solo da 1px exacto si el root es 16px; con
      otro root queda en subpixel y el navegador redondea por lado, lo que
      produce bordes de grosor distinto entre lados del mismo elemento.

    - font-weight: el CDN los publica como px (400px, 500px, 700px), que ya es
      invalido para la propiedad font-weight. Convertirlos a rem no lo corrige
      y oscurece el bug de origen.

    - shape-full (1000px): no es una medida sino un sentinela para "pildora
      completa". Convertirlo no aporta nada.

.EXAMPLE
  pwsh -File scripts/tokens/build-rem-tokens.ps1
#>
[CmdletBinding()]
param(
  [double]$RootFontSize = 16,
  [string]$VendorCss
)

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
if (-not $VendorCss) {
  $VendorCss = Join-Path $repoRoot 'projects/crdx-components/src/lib/styles/tokens/vendor/credix-tokens.css'
}
$remCss = [IO.Path]::ChangeExtension($VendorCss, $null) + 'rem.css'
$remCss = $VendorCss -replace '\.css$', '.rem.css'

if (-not (Test-Path $VendorCss)) { throw "No existe el vendor: $VendorCss" }

$content = Get-Content -Raw $VendorCss
if ([string]::IsNullOrWhiteSpace($content)) { throw "El vendor esta vacio: $VendorCss" }

# Tokens que se mantienen en px. Ver .NOTES para el razonamiento de cada uno.
$excludePatterns = @(
  'outline-width'
  'border-width'
  'indicator-thickness'
  'indicator-weight'
  'font-weight'
  'shape-full'
)

function Test-Excluded([string]$name) {
  foreach ($p in $excludePatterns) {
    if ($name -like "*$p*") { return $true }
  }
  return $false
}

$converted = 0
$excluded = 0
$pxOccurrences = 0

# Recorre cada declaracion `--nombre: valor` y convierte los px del valor.
$result = [regex]::Replace($content, '(--[a-zA-Z0-9_-]+)\s*:\s*([^;}]+)', {
  param($m)

  $name = $m.Groups[1].Value
  $value = $m.Groups[2].Value

  if ($value -notmatch '\d+(\.\d+)?px') { return $m.Value }

  if (Test-Excluded $name) {
    $script:excluded++
    return $m.Value
  }

  $newValue = [regex]::Replace($value, '(-?\d+(?:\.\d+)?)px', {
    param($px)
    $script:pxOccurrences++
    $n = [double]$px.Groups[1].Value
    if ($n -eq 0) { return '0' }
    $rem = $n / $script:RootFontSize
    # Redondeo a 6 decimales y limpieza de ceros finales para no ensuciar el diff.
    $formatted = [math]::Round($rem, 6).ToString([Globalization.CultureInfo]::InvariantCulture)
    return "${formatted}rem"
  })

  $script:converted++
  return "$name`: $newValue"
})

$header = @"
/**
 * ARCHIVO GENERADO - NO EDITAR A MANO.
 * Regenerar con: pwsh -File scripts/tokens/build-rem-tokens.ps1
 *
 * Variante en rem de credix-tokens.css (root asumido: ${RootFontSize}px).
 * Se mantienen en px: grosores de linea, font-weight y shape-full.
 * Fuente de verdad: credix-tokens.css (no editar este derivado).
 */

"@

Set-Content -Path $remCss -Value ($header + $result) -Encoding utf8 -NoNewline

Write-Host 'Listo.' -ForegroundColor Green
Write-Host ("  declaraciones convertidas : {0}" -f $converted)
Write-Host ("  declaraciones excluidas   : {0}" -f $excluded)
Write-Host ("  valores px -> rem         : {0}" -f $pxOccurrences)
Write-Host ("  salida                    : {0}" -f (Resolve-Path $remCss -Relative))
