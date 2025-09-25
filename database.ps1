#!/usr/bin/env pwsh
# Script para correr base de datos

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