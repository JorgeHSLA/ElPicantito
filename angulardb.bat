@echo off
REM Script para correr Angular y Base de datos - CMD

echo Iniciando Angular y Base de datos...

REM Iniciar Angular primero
echo 1. Iniciando Angular...
if exist "picantito-Angular" (
    cd picantito-Angular
    
    if not exist "node_modules" (
        echo Instalando dependencias de Angular...
        npm install
    )
    
    start "Angular Dev Server" cmd /k "npm start"
    cd ..
    echo Angular iniciado en nueva ventana
) else (
    echo Advertencia: No se encontro carpeta de Angular
)

timeout /t 2 /nobreak >nul

REM Iniciar base de datos
echo 2. Iniciando Base de datos...
if exist "docker-compose.yml" (
    docker --version >nul 2>&1
    if not errorlevel 1 (
        start "Database Container" cmd /k "docker-compose up db"
        echo Base de datos iniciada en nueva ventana
    ) else (
        echo Advertencia: Docker no disponible, saltando base de datos
    )
) else (
    echo Advertencia: No se encontro docker-compose.yml
)

echo Servicios iniciandose...
echo Angular: http://localhost:4200
echo Base de datos: localhost:5432
pause