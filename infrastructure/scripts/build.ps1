# Script PowerShell para construir todas las aplicaciones
# Ejecutar desde la raiz del proyecto: .\infrastructure\scripts\build.ps1

Write-Host "Construyendo El Picantito - Todas las Aplicaciones" -ForegroundColor Green

$ErrorActionPreference = "Stop"

try {
    # Construir Backend (deshabilitado por ahora)
    # Write-Host "Construyendo Backend..." -ForegroundColor Blue
    # Set-Location "apps\backend"
    # if ($IsWindows -or $env:OS -eq "Windows_NT") {
    #     .\mvnw.cmd clean package -DskipTests
    # } else {
    #     ./mvnw clean package -DskipTests
    # }
    # Set-Location "..\.."
    # Write-Host "Backend construido correctamente" -ForegroundColor Green

    # Construir Frontend
    Write-Host "Construyendo Frontend..." -ForegroundColor Cyan
    Set-Location "apps\frontend"
    npm install
    npx ng build --configuration production
    Set-Location "..\.."
    Write-Host "Frontend construido correctamente" -ForegroundColor Green

    # Preparar Chatbot (deshabilitado por ahora)
    # Write-Host "Validando Chatbot..." -ForegroundColor Magenta
    # Set-Location "apps\chatbot"
    # pip install -r requirements.txt
    # Set-Location "..\.."
    # Write-Host "Chatbot validado correctamente" -ForegroundColor Green

    Write-Host ""
    Write-Host "Frontend construido exitosamente" -ForegroundColor Green
    Write-Host "Artefactos generados en:" -ForegroundColor White
    Write-Host "   Frontend: apps/frontend/dist/" -ForegroundColor Cyan

} catch {
    Write-Host ""
    Write-Host "Error durante la construccion: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}