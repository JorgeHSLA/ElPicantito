@echo off
REM Script para correr base de datos - CMD

echo Iniciando secuencia: Spring Boot -> (espera 10s) -> Base de datos -> Angular (si existe)...

REM 1) Intentar iniciar Spring Boot en una nueva ventana
if exist "springboot.bat" (
    echo Iniciando Spring Boot (springboot.bat)...
    start "Spring Boot" cmd /k "call springboot.bat"
) else (
    echo Advertencia: springboot.bat no encontrado. No se iniciara Spring Boot automaticamente.
)

REM Esperar 10 segundos antes de iniciar la base de datos (Spring Boot necesita arrancar)
timeout /t 10 /nobreak >nul

REM 2) Iniciar base de datos
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

REM 3) Si existe Angular, iniciarlo ahora
timeout /t 2 /nobreak >nul
if exist "picantito-Angular" (
    echo Iniciando Angular (picantito-Angular)...
    cd picantito-Angular
    if not exist "node_modules" (
        echo Instalando dependencias de Angular...
        npm install
    )
    start "Angular Dev Server" cmd /k "npm start"
    cd ..
    echo Angular (si existia) lanzado en nueva ventana
) else (
    echo Angular no encontrado, saltando inicio de Angular
)

pause