#!/bin/bash
# Script para correr Angular y Base de datos - Linux

echo "Iniciando Angular y Base de datos..."

# Iniciar Angular primero
echo "1. Iniciando Angular..."
if [ -d "picantito-Angular" ]; then
    cd picantito-Angular
    
    if [ ! -d "node_modules" ]; then
        echo "Instalando dependencias de Angular..."
        npm install
    fi
    
    gnome-terminal --title="Angular Dev Server" -- bash -c "npm start; exec bash" 2>/dev/null || \
    xterm -title "Angular Dev Server" -e "npm start; bash" 2>/dev/null || \
    konsole --title "Angular Dev Server" -e bash -c "npm start; exec bash" 2>/dev/null || \
    bash -c "npm start" &
    
    cd ..
    echo "Angular iniciado en nueva terminal"
else
    echo "Advertencia: No se encontro carpeta de Angular"
fi

sleep 2

# Iniciar base de datos
echo "2. Iniciando Base de datos..."
if [ -f "docker-compose.yml" ]; then
    if command -v docker &> /dev/null; then
        gnome-terminal --title="Database Container" -- bash -c "docker-compose up db; exec bash" 2>/dev/null || \
        xterm -title "Database Container" -e "docker-compose up db; bash" 2>/dev/null || \
        konsole --title "Database Container" -e bash -c "docker-compose up db; exec bash" 2>/dev/null || \
        bash -c "docker-compose up db" &
        echo "Base de datos iniciada en nueva terminal"
    else
        echo "Advertencia: Docker no disponible, saltando base de datos"
    fi
else
    echo "Advertencia: No se encontro docker-compose.yml"
fi

echo "Servicios iniciandose..."
echo "Angular: http://localhost:4200"
echo "Base de datos: localhost:5432"