#!/usr/bin/env pwsh
# Wrapper antiguo angulardb.ps1 -> ahora use run.ps1

Write-Host "Este script fue reemplazado. Ejecutando 'run.ps1' en su lugar..." -ForegroundColor Yellow
if (Test-Path "run.ps1") {
    Start-Process powershell -ArgumentList "-NoExit", "-File", "./run.ps1"
} else {
    Write-Host "No se encontro run.ps1. Si desea renombrar/eliminar, mueva angulardb.ps1 a run.ps1 o ejecute run.ps1 directamente." -ForegroundColor Red
}