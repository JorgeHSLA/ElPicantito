#!/usr/bin/env pwsh
# Script "run" para PowerShell: Spring Boot -> (10s) -> Base de datos -> Angular

Write-Host "Ejecutando secuencia: Spring Boot -> (espera 10s) -> Base de datos -> Angular (si existe)..." -ForegroundColor Green

# 1) Iniciar Spring Boot
if (Test-Path "springboot.ps1") {
    Write-Host "Iniciando Spring Boot (springboot.ps1)..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-File", "./springboot.ps1"
} else {
    Write-Host "Advertencia: springboot.ps1 no encontrado. Saltando inicio automatico de Spring Boot." -ForegroundColor Yellow
}

# 2) Esperar 10 segundos
Start-Sleep -Seconds 10

# 3) Iniciar Base de datos
Write-Host "Iniciando Base de datos..." -ForegroundColor Green
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

# 4) Iniciar Angular (si existe)
Start-Sleep -Seconds 2
if (Test-Path "picantito-Angular") {
    Write-Host "Iniciando Angular (picantito-Angular)..." -ForegroundColor Yellow
    Set-Location "picantito-Angular"
    if (-not (Test-Path "node_modules")) {
        Write-Host "Instalando dependencias de Angular..." -ForegroundColor Yellow
        npm install
    }
    # Abrir una nueva ventana con npm start
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start"
    Set-Location ".."
    Write-Host "Angular iniciado en nueva ventana" -ForegroundColor Green
} else {
    Write-Host "Angular no encontrado, saltando inicio de Angular" -ForegroundColor Yellow
}
