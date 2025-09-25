#!/usr/bin/env pwsh
# Script para correr Angular y Base de datos

Write-Host "Iniciando Angular y Base de datos..." -ForegroundColor Green

# Iniciar Angular primero
Write-Host "1. Iniciando Angular..." -ForegroundColor Yellow
if (Test-Path "picantito-Angular") {
    Set-Location "picantito-Angular"
    
    if (-not (Test-Path "node_modules")) {
        Write-Host "Instalando dependencias de Angular..." -ForegroundColor Yellow
        npm install
    }
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm start"
    Set-Location ".."
    Write-Host "Angular iniciado en nueva ventana" -ForegroundColor Green
} else {
    Write-Host "Advertencia: No se encontro carpeta de Angular" -ForegroundColor Red
}

Start-Sleep -Seconds 2

# Iniciar base de datos
Write-Host "2. Iniciando Base de datos..." -ForegroundColor Yellow
if (Test-Path "docker-compose.yml") {
    try {
        docker --version | Out-Null
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "docker-compose up db"
        Write-Host "Base de datos iniciada en nueva ventana" -ForegroundColor Green
    } catch {
        Write-Host "Advertencia: Docker no disponible, saltando base de datos" -ForegroundColor Red
    }
} else {
    Write-Host "Advertencia: No se encontro docker-compose.yml" -ForegroundColor Red
}

Write-Host "Servicios iniciandose..." -ForegroundColor Green
Write-Host "Angular: http://localhost:4200" -ForegroundColor Cyan
Write-Host "Base de datos: localhost:5432" -ForegroundColor Cyan