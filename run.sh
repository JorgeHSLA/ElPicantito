#!/bin/bash
# Script "run" para Linux: Spring Boot -> (10s) -> Base de datos -> Angular

echo "Ejecutando secuencia: Spring Boot -> (espera 10s) -> Base de datos -> Angular (si existe)..."

# 1) Iniciar Spring Boot si existe
if [ -f "springboot.sh" ]; then
    echo "Iniciando Spring Boot (springboot.sh)..."
    gnome-terminal --title="Spring Boot" -- bash -c "./springboot.sh; exec bash" 2>/dev/null || \
    xterm -title "Spring Boot" -e "./springboot.sh; bash" 2>/dev/null || \
    konsole --title "Spring Boot" -e bash -c "./springboot.sh; exec bash" 2>/dev/null || \
    bash -c "./springboot.sh" &
else
    echo "Advertencia: springboot.sh no encontrado. Saltando inicio automatico de Spring Boot."
fi

# 2) Esperar 10 segundos
sleep 10

# 3) Iniciar Base de datos
echo "Iniciando Base de datos..."
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

# 4) Iniciar Angular si existe
sleep 2
if [ -d "picantito-Angular" ]; then
    echo "Iniciando Angular (picantito-Angular)..."
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
    echo "Angular no encontrado, saltando inicio de Angular"
fi
