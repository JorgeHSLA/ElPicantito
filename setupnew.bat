@echo off
REM Script de configuracion inicial para PC nueva
REM Ejecutar desde la raiz del proyecto: setupnew.bat

echo Configurando El Picantito en PC nueva...

REM Verificar Node.js
echo Verificando Node.js...
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: Node.js no esta instalado
    echo Instala Node.js desde: https://nodejs.org
    pause
    exit /b 1
)
node --version
echo Node.js encontrado correctamente

REM Verificar npm
echo Verificando npm...
where npm >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: npm no esta disponible
    pause
    exit /b 1
)
npm --version
echo npm encontrado correctamente

REM Verificar Docker
echo Verificando Docker...
where docker >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: Docker no esta instalado
    echo Instala Docker Desktop desde: https://docker.com/products/docker-desktop
    pause
    exit /b 1
)

REM Verificar si Docker esta corriendo
docker info >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: Docker no esta ejecutandose
    echo Inicia Docker Desktop y vuelve a ejecutar este script
    pause
    exit /b 1
)
echo Docker esta funcionando correctamente

REM Instalar dependencias de Angular
echo.
echo Instalando dependencias de Angular...
cd apps\frontend
npm install
if %ERRORLEVEL% neq 0 (
    echo Error instalando dependencias de npm
    pause
    exit /b 1
)
cd ..\..
echo Dependencias de Angular instaladas correctamente

echo.
echo === CONFIGURACION COMPLETADA ===
echo Todas las dependencias instaladas correctamente
echo.
echo Para iniciar el proyecto, usa:
echo   infrastructure\scripts\start.bat
echo.
echo URLs que estaran disponibles al iniciar:
echo   Frontend:  http://localhost:4200
echo   Database:  localhost:5432
echo   PgAdmin:   http://localhost:5050 (admin@admin.com / admin)
pause