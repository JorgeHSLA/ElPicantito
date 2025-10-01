#!/bin/bash
# Script para correr Angular - Linux

echo "Iniciando aplicacion Angular..."

if [ ! -d "picantito-Angular" ]; then
    echo "Error: No se encontro la carpeta picantito-Angular"
    exit 1
fi

cd picantito-Angular

if [ ! -d "node_modules" ]; then
    echo "Instalando dependencias de Angular..."
    npm install
fi

echo "Iniciando servidor de desarrollo Angular..."
gnome-terminal --title="Angular Dev Server" -- bash -c "npm start; exec bash" 2>/dev/null || \
xterm -title "Angular Dev Server" -e "npm start; bash" 2>/dev/null || \
konsole --title "Angular Dev Server" -e bash -c "npm start; exec bash" 2>/dev/null || \
bash -c "npm start" &

echo "Angular se esta iniciando en una nueva terminal..."
echo "Disponible en: http://localhost:4200"

cd ..