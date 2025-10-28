@echo off
REM Script "run" para Windows: Spring Boot -> (10s) -> Base de datos -> Angular

echo Ejecutando secuencia: Spring Boot -> (espera 10s) -> Base de datos -> Angular (si existe)...

REM 1) Iniciar Spring Boot
if exist "springboot.bat" (
    echo Iniciando Spring Boot (springboot.bat)...
    start "Spring Boot" cmd /k "call springboot.bat"
) else (
    echo Advertencia: springboot.bat no encontrado. Saltando inicio automatico de Spring Boot.
)

REM 2) Esperar 10 segundos para que Spring Boot tenga tiempo de arrancar
timeout /t 10 /nobreak >nul

REM 3) Iniciar Base de datos
echo Iniciando Base de datos...
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

REM 4) Iniciar Angular (si existe)
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
    echo Angular iniciado en nueva ventana
) else (
    echo Angular no encontrado, saltando inicio de Angular
)

pause
