#!/usr/bin/env pwsh
# Script para correr base de datos

Write-Host "Iniciando secuencia: Spring Boot -> (espera 10s) -> Base de datos -> Angular (si existe)..." -ForegroundColor Green

# 1) Iniciar Spring Boot en nueva ventana (si existe el script)
if (Test-Path "springboot.ps1") {
    Write-Host "Iniciando Spring Boot (springboot.ps1)..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-File", "./springboot.ps1"
} else {
    Write-Host "Advertencia: springboot.ps1 no encontrado. No se iniciara Spring Boot automaticamente." -ForegroundColor Yellow
}

# Esperar 10 segundos antes de iniciar la base de datos
Start-Sleep -Seconds 10

# 2) Iniciar base de datos
Write-Host "Iniciando base de datos..." -ForegroundColor Green

if (-not (Test-Path "docker-compose.yml")) {
    Write-Host "Error: No se encontro docker-compose.yml" -ForegroundColor Red
    exit 1
}

Write-Host "Verificando Docker..." -ForegroundColor Yellow
try {
    docker --version | Out-Null
    docker-compose --version | Out-Null
} catch {
    Write-Host "Error: Docker o docker-compose no esta instalado" -ForegroundColor Red
    exit 1
}

Write-Host "Iniciando contenedor de base de datos..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "docker-compose up db"

Write-Host "Base de datos se esta iniciando en una nueva ventana..." -ForegroundColor Green
Write-Host "PostgreSQL estara disponible en: localhost:5432" -ForegroundColor Cyan
Write-Host "Base de datos: picantitodb" -ForegroundColor Cyan
Write-Host "Usuario: taquito" -ForegroundColor Cyan

# 3) Si existe Angular, iniciarlo ahora
Start-Sleep -Seconds 2
if (Test-Path "picantito-Angular") {
    Write-Host "Iniciando Angular (picantito-Angular)..." -ForegroundColor Yellow
    Set-Location "picantito-Angular"
    if (-not (Test-Path "node_modules")) {
        Write-Host "Instalando dependencias de Angular..." -ForegroundColor Yellow
        npm install
    }
    Start-Process powershell -ArgumentList "-NoExit", "-File", "-", "npm start" -NoNewWindow:$false | Out-Null
    # Fallback: abrir nueva ventana con npm start
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start"
    Set-Location ".."
    Write-Host "Angular (si existia) lanzado en nueva ventana" -ForegroundColor Green
} else {
    Write-Host "Angular no encontrado, saltando inicio de Angular" -ForegroundColor Yellow
}