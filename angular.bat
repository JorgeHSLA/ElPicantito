@echo off
REM Script para correr Angular - CMD

echo Iniciando aplicacion Angular...

if not exist "picantito-Angular" (
    echo Error: No se encontro la carpeta picantito-Angular
    pause
    exit /b 1
)

cd picantito-Angular

if not exist "node_modules" (
    echo Instalando dependencias de Angular...
    npm install
)

echo Iniciando servidor de desarrollo Angular...
start "Angular Dev Server" cmd /k "npm start"

echo Angular se esta iniciando en una nueva ventana...
echo Disponible en: http://localhost:4200

cd ..
pause