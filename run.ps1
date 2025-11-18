#!/usr/bin/env pwsh
# Script "run" para PowerShell: Base de datos (Docker) -> Spring Boot -> Angular
# ⚠️ NO OLVIDES PONER EL ARCHIVO .env EN LA RAIZ DEL PROYECTO

Write-Host "Ejecutando secuencia: Base de datos -> Spring Boot -> Angular..." -ForegroundColor Green

# 1) Iniciar Base de datos (Docker)
Write-Host "Iniciando Base de datos con Docker..." -ForegroundColor Cyan
if (Test-Path "docker-compose.yml") {
    try {
        docker --version | Out-Null
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "docker-compose up db"
        Write-Host "Base de datos iniciada en nueva ventana" -ForegroundColor Green
    } catch {
        Write-Host "Error: Docker no disponible. Instale Docker para continuar." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Error: No se encontro docker-compose.yml" -ForegroundColor Red
    exit 1
}

# 2) Esperar 15 segundos para que la base de datos este lista
Write-Host "Esperando 15 segundos para que la base de datos este lista..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# 3) Iniciar Spring Boot
if (Test-Path ".\springboot.ps1") {
    Write-Host "Iniciando Spring Boot..." -ForegroundColor Yellow
    $springbootPath = Join-Path $PSScriptRoot "springboot.ps1"
    Start-Process powershell -ArgumentList "-NoExit", "-File", $springbootPath
    Write-Host "Spring Boot iniciado en nueva ventana" -ForegroundColor Green
} else {
    Write-Host "Advertencia: springboot.ps1 no encontrado en la ruta actual." -ForegroundColor Red
}

# 4) Esperar 10 segundos para que Spring Boot arranque
Write-Host "Esperando 10 segundos para que Spring Boot arranque..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# 5) Iniciar Angular (si existe)
if (Test-Path ".\picantito-Angular") {
    Write-Host "Iniciando Angular..." -ForegroundColor Yellow
    $angularPath = Join-Path $PSScriptRoot "picantito-Angular"
    Push-Location $angularPath
    
    if (-not (Test-Path "node_modules")) {
        Write-Host "Instalando dependencias de Angular..." -ForegroundColor Yellow
        npm install
    }
    
    # Abrir una nueva ventana con npm start
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$angularPath'; npm start"
    Pop-Location
    Write-Host "Angular iniciado en nueva ventana" -ForegroundColor Green
} else {
    Write-Host "Advertencia: carpeta picantito-Angular no encontrada" -ForegroundColor Yellow
}

Write-Host "`nTodos los servicios han sido iniciados exitosamente!" -ForegroundColor Green
Write-Host "Base de datos: http://localhost:5432" -ForegroundColor Cyan
Write-Host "Spring Boot: http://localhost:8080" -ForegroundColor Cyan
Write-Host "Angular: http://localhost:4200" -ForegroundColor Cyan
