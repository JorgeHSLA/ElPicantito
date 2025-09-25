#!/usr/bin/env pwsh
# Script para correr Angular

Write-Host "Iniciando aplicacion Angular..." -ForegroundColor Green

if (-not (Test-Path "picantito-Angular")) {
    Write-Host "Error: No se encontro la carpeta picantito-Angular" -ForegroundColor Red
    exit 1
}

Set-Location "picantito-Angular"

if (-not (Test-Path "node_modules")) {
    Write-Host "Instalando dependencias de Angular..." -ForegroundColor Yellow
    npm install
}

Write-Host "Iniciando servidor de desarrollo Angular..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm start"

Write-Host "Angular se esta iniciando en una nueva ventana..." -ForegroundColor Green
Write-Host "Disponible en: http://localhost:4200" -ForegroundColor Cyan

Set-Location ".."