#!/usr/bin/env pwsh
# Script para correr Spring Boot

Write-Host "Iniciando aplicacion Spring Boot..." -ForegroundColor Green

if (-not (Test-Path "pom.xml")) {
    Write-Host "Error: No se encontro pom.xml" -ForegroundColor Red
    exit 1
}

# Cargar variables de entorno desde .env si existe
if (Test-Path ".env") {
    Write-Host "Cargando variables de entorno desde .env..." -ForegroundColor Yellow
    Get-Content ".env" | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]*)\s*=\s*(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            [System.Environment]::SetEnvironmentVariable($name, $value, [System.EnvironmentVariableTarget]::Process)
            Write-Host "  $name cargado" -ForegroundColor Gray
        }
    }
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
& $mvnCmd spring-boot:run

Write-Host "Spring Boot finalizado." -ForegroundColor Green