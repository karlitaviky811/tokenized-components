# Volcado del inventario de tokens publicados en el CDN.
#
# Genera `tmp-cdn-tokens.txt` con una declaracion por linea (`--nombre: valor`),
# ordenado y sin duplicados. Sirve para verificar que un `var(--token)` existe
# realmente antes de escribirlo, en lugar de descubrirlo como fallback silencioso.
#
# Uso (desde la raiz del repo):
#   powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tokens/dump-cdn-tokens.ps1

$ErrorActionPreference = 'Stop'

$url = 'https://4pgkhwcphxlnvvjb.public.blob.vercel-storage.com/styles2.min.css'
$out = 'tmp-cdn-tokens.txt'

Write-Host "Descargando $url ..."
$css = (Invoke-WebRequest -Uri $url -UseBasicParsing).Content

$decls = [regex]::Matches($css, '--[A-Za-z0-9_-]+\s*:\s*[^;}]+') |
    ForEach-Object { ($_.Value -replace '\s+', ' ').Trim() } |
    Sort-Object -Unique

$decls | Set-Content -Path $out -Encoding UTF8

Write-Host "OK -> $out"
Write-Host "Declaraciones unicas: $($decls.Count)"

# Desglose por prefijo, para confirmar la convencion de nombres del CDN.
$colors = ($decls | Where-Object { $_ -like '--color-*' }).Count
$strings = ($decls | Where-Object { $_ -like '--string-*' }).Count
$shadows = ($decls | Where-Object { $_ -like '--shadow-*' }).Count
Write-Host "  --color-*  : $colors"
Write-Host "  --string-* : $strings"
Write-Host "  --shadow-* : $shadows"
Write-Host "  resto (dimensiones/numeros): $($decls.Count - $colors - $strings - $shadows)"
