@echo off
REM Script "run" para Windows: Base de datos (Docker) -> Spring Boot -> Angular
REM ⚠️ NO OLVIDES PONER EL ARCHIVO .env EN LA RAIZ DEL PROYECTO

echo Ejecutando secuencia: Base de datos -^> Spring Boot -^> Angular...

REM 1) Iniciar Base de datos con Docker
echo Iniciando Base de datos con Docker...
if exist "docker-compose.yml" (
    docker --version >nul 2>&1
    if not errorlevel 1 (
        start "Database Container" cmd /k "docker-compose up db"
        echo Base de datos iniciada en nueva ventana
    ) else (
        echo Error: Docker no disponible. Instale Docker para continuar.
        pause
        exit /b 1
    )
) else (
    echo Error: No se encontro docker-compose.yml
    pause
    exit /b 1
)

REM 2) Esperar 15 segundos para que la base de datos este lista
echo Esperando 15 segundos para que la base de datos este lista...
timeout /t 15 /nobreak >nul

REM 3) Iniciar Spring Boot
if exist "%~dp0springboot.bat" (
    echo Iniciando Spring Boot...
    start "Spring Boot" cmd /k "call "%~dp0springboot.bat""
    echo Spring Boot iniciado en nueva ventana
) else (
    echo Advertencia: springboot.bat no encontrado en la ruta actual.
)

REM 4) Esperar 10 segundos para que Spring Boot arranque
echo Esperando 10 segundos para que Spring Boot arranque...
timeout /t 10 /nobreak >nul

REM 5) Iniciar Angular (si existe)
if exist "%~dp0picantito-Angular" (
    echo Iniciando Angular...
    cd /d "%~dp0picantito-Angular"
    if not exist "node_modules" (
        echo Instalando dependencias de Angular...
        call npm install
    )
    start "Angular Dev Server" cmd /k "npm start"
    cd /d "%~dp0"
    echo Angular iniciado en nueva ventana
) else (
    echo Advertencia: carpeta picantito-Angular no encontrada
)

echo.
echo Todos los servicios han sido iniciados exitosamente!
echo Base de datos: http://localhost:5432
echo Spring Boot: http://localhost:8080
echo Angular: http://localhost:4200
echo.
pause
