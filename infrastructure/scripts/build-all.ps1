# Script para construir todas las aplicaciones
# Ejecutar desde la raíz del proyecto

Write-Host "🏗️ Construyendo El Picantito - Todas las Aplicaciones" -ForegroundColor Green

$ErrorActionPreference = "Stop"

try {
    # Construir Backend
    Write-Host "🔧 Construyendo Backend..." -ForegroundColor Blue
    Set-Location "apps\backend"
    .\mvnw clean package -DskipTests
    Set-Location "..\.."
    Write-Host "✅ Backend construido correctamente" -ForegroundColor Green

    # Construir Frontend
    Write-Host "🎨 Construyendo Frontend..." -ForegroundColor Cyan
    Set-Location "apps\frontend"
    npm install
    ng build --prod
    Set-Location "..\.."
    Write-Host "✅ Frontend construido correctamente" -ForegroundColor Green

    # Preparar Chatbot
    Write-Host "🤖 Validando Chatbot..." -ForegroundColor Magenta
    Set-Location "apps\chatbot"
    pip install -r requirements.txt
    Set-Location "..\.."
    Write-Host "✅ Chatbot validado correctamente" -ForegroundColor Green

    Write-Host ""
    Write-Host "🎉 Todas las aplicaciones construidas exitosamente!" -ForegroundColor Green
    Write-Host "📦 Artefactos generados en:" -ForegroundColor White
    Write-Host "   Backend:  apps/backend/target/" -ForegroundColor Blue
    Write-Host "   Frontend: apps/frontend/dist/" -ForegroundColor Cyan

} catch {
    Write-Host ""
    Write-Host "❌ Error durante la construcción: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}