@echo off
REM Script para correr base de datos - CMD

echo Iniciando base de datos...

if not exist "docker-compose.yml" (
    echo Error: No se encontro docker-compose.yml
    pause
    exit /b 1
)

echo Verificando Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo Error: Docker no esta instalado
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo Error: docker-compose no esta instalado
    pause
    exit /b 1
)

echo Iniciando contenedor de base de datos...
start "Database Container" cmd /k "docker-compose up db"

echo Base de datos se esta iniciando en una nueva ventana...
echo PostgreSQL estara disponible en: localhost:5432
echo Base de datos: picantitodb
echo Usuario: taquito
pause