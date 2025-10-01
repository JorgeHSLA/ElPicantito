#!/usr/bin/env pwsh
# Script para correr Spring Boot

Write-Host "Iniciando aplicacion Spring Boot..." -ForegroundColor Green

if (-not (Test-Path "pom.xml")) {
    Write-Host "Error: No se encontro pom.xml" -ForegroundColor Red
    exit 1
}

Write-Host "Verificando Maven..." -ForegroundColor Yellow
try {
    if (Test-Path "mvnw.cmd") {
        Write-Host "Usando Maven Wrapper..." -ForegroundColor Yellow
        $mvnCmd = ".\mvnw.cmd"
    } else {
        mvn --version | Out-Null
        $mvnCmd = "mvn"
    }
} catch {
    Write-Host "Error: Maven no esta instalado" -ForegroundColor Red
    exit 1
}

Write-Host "Compilando y ejecutando Spring Boot..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "$mvnCmd spring-boot:run"

Write-Host "Spring Boot se esta iniciando en una nueva ventana..." -ForegroundColor Green
Write-Host "API estara disponible en: http://localhost:8080" -ForegroundColor Cyan