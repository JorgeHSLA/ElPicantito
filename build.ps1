#!/usr/bin/env pwsh
# Script para instalar todas las dependencias

Write-Host "Instalando todas las dependencias del proyecto..." -ForegroundColor Green

$errors = @()

# Configurar permisos de ejecución
Write-Host "1. Configurando permisos de ejecución..." -ForegroundColor Yellow
try {
    Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
    Write-Host "Permisos de ejecución configurados" -ForegroundColor Green
} catch {
    Write-Host "Advertencia: No se pudieron configurar los permisos automáticamente" -ForegroundColor Yellow
    Write-Host "Ejecute manualmente: Set-ExecutionPolicy RemoteSigned -Scope CurrentUser" -ForegroundColor Yellow
}

# Verificar Node.js y npm
Write-Host "2. Verificando Node.js y npm..." -ForegroundColor Yellow
try {
    node --version | Out-Null
    npm --version | Out-Null
    Write-Host "Node.js y npm encontrados" -ForegroundColor Green
} catch {
    $errors += "Node.js y npm no estan instalados"
    Write-Host "Error: Node.js y npm no estan instalados" -ForegroundColor Red
}

# Instalar Angular CLI
Write-Host "3. Instalando Angular CLI..." -ForegroundColor Yellow
try {
    ng version 2>&1 | Out-Null
    Write-Host "Angular CLI ya está instalado" -ForegroundColor Green
} catch {
    Write-Host "Instalando Angular CLI globalmente..." -ForegroundColor Yellow
    npm install -g @angular/cli
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Angular CLI instalado correctamente" -ForegroundColor Green
    } else {
        $errors += "Error instalando Angular CLI"
        Write-Host "Error instalando Angular CLI" -ForegroundColor Red
    }
}

# Verificar Java
Write-Host "4. Verificando Java..." -ForegroundColor Yellow
try {
    java -version 2>&1 | Out-Null
    Write-Host "Java encontrado" -ForegroundColor Green
} catch {
    $errors += "Java no esta instalado"
    Write-Host "Error: Java no esta instalado" -ForegroundColor Red
}

# Verificar Maven
Write-Host "5. Verificando Maven..." -ForegroundColor Yellow
if (Test-Path "mvnw.cmd") {
    Write-Host "Maven Wrapper encontrado" -ForegroundColor Green
} else {
    try {
        mvn --version | Out-Null
        Write-Host "Maven encontrado" -ForegroundColor Green
    } catch {
        $errors += "Maven no esta instalado"
        Write-Host "Error: Maven no esta instalado" -ForegroundColor Red
    }
}

# Verificar Docker
Write-Host "6. Verificando Docker..." -ForegroundColor Yellow
try {
    docker --version | Out-Null
    docker-compose --version | Out-Null
    Write-Host "Docker y docker-compose encontrados" -ForegroundColor Green
} catch {
    $errors += "Docker o docker-compose no estan instalados"
    Write-Host "Error: Docker o docker-compose no estan instalados" -ForegroundColor Red
}

# Instalar dependencias de Angular
if (Test-Path "picantito-Angular") {
    Write-Host "7. Instalando dependencias de Angular..." -ForegroundColor Yellow
    Set-Location "picantito-Angular"
    try {
        npm install
        Write-Host "Dependencias de Angular instaladas correctamente" -ForegroundColor Green
    } catch {
        $errors += "Error instalando dependencias de Angular"
        Write-Host "Error instalando dependencias de Angular" -ForegroundColor Red
    }
    Set-Location ".."
} else {
    Write-Host "Advertencia: No se encontro carpeta picantito-Angular" -ForegroundColor Red
}

# Compilar Spring Boot
if (Test-Path "pom.xml") {
    Write-Host "8. Compilando proyecto Spring Boot..." -ForegroundColor Yellow
    try {
        if (Test-Path "mvnw.cmd") {
            .\mvnw.cmd clean compile
        } else {
            mvn clean compile
        }
        Write-Host "Proyecto Spring Boot compilado correctamente" -ForegroundColor Green
    } catch {
        $errors += "Error compilando Spring Boot"
        Write-Host "Error compilando Spring Boot" -ForegroundColor Red
    }
} else {
    Write-Host "Advertencia: No se encontro pom.xml" -ForegroundColor Red
}

# Descargar imagenes de Docker
Write-Host "9. Descargando imagenes de Docker..." -ForegroundColor Yellow
try {
    docker pull postgres:16.1
    Write-Host "Imagen de PostgreSQL descargada" -ForegroundColor Green
} catch {
    $errors += "Error descargando imagen de Docker"
    Write-Host "Error descargando imagen de Docker" -ForegroundColor Red
}

# Resumen
Write-Host "`nResumen de instalacion:" -ForegroundColor Cyan
if ($errors.Count -eq 0) {
    Write-Host "Todas las dependencias se instalaron correctamente!" -ForegroundColor Green
    Write-Host "El proyecto esta listo para ejecutarse" -ForegroundColor Green
} else {
    Write-Host "Se encontraron los siguientes errores:" -ForegroundColor Red
    foreach ($err in $errors) {
        Write-Host "- $err" -ForegroundColor Red
    }
}

Write-Host "`nPara iniciar los servicios use:" -ForegroundColor Cyan
Write-Host "- .\angular.ps1     (solo Angular)" -ForegroundColor White
Write-Host "- .\database.ps1    (solo Base de datos)" -ForegroundColor White
Write-Host "- .\springboot.ps1  (solo Spring Boot)" -ForegroundColor White
Write-Host "- .\angulardb.ps1   (Angular + Base de datos)" -ForegroundColor White