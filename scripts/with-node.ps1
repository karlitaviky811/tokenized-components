<#
.SYNOPSIS
  Activa Node via fnm y ejecuta el comando recibido.

.DESCRIPTION
  fnm necesita que el shell evalue `fnm env` para inyectar el PATH de Node.
  Sin eso, `node` y `npm` no existen en la sesion.
  Solucion permanente: agregar esta linea a $PROFILE
    fnm env --use-on-cd --shell power-shell | Out-String | Invoke-Expression

.EXAMPLE
  pwsh -File scripts/with-node.ps1 -Command 'npm install'
  pwsh -File scripts/with-node.ps1 -Command 'npx ng build crdx-components'
#>
[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)][string]$Command,
  [string]$NodeVersion = '22'
)

$ErrorActionPreference = 'Stop'

fnm env --use-on-cd --shell power-shell | Out-String | Invoke-Expression
fnm use $NodeVersion

Write-Host "node $(node -v) / npm $(npm -v)" -ForegroundColor DarkGray
Write-Host "> $Command" -ForegroundColor Cyan

Invoke-Expression $Command
exit $LASTEXITCODE
