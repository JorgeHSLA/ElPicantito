#!/bin/bash
# Script "run" para Linux: Base de datos (Docker) -> Spring Boot -> Angular
# ⚠️ NO OLVIDES PONER EL ARCHIVO .env EN LA RAIZ DEL PROYECTO

echo "Ejecutando secuencia: Base de datos -> Spring Boot -> Angular..."

# Obtener la ruta del script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# 1) Iniciar Base de datos con Docker
echo "Iniciando Base de datos con Docker..."
if [ -f "$SCRIPT_DIR/docker-compose.yml" ]; then
    if command -v docker &> /dev/null; then
        gnome-terminal --title="Database Container" -- bash -c "cd '$SCRIPT_DIR' && docker-compose up db; exec bash" 2>/dev/null || \
        xterm -title "Database Container" -e "cd '$SCRIPT_DIR' && docker-compose up db; bash" 2>/dev/null || \
        konsole --title "Database Container" -e bash -c "cd '$SCRIPT_DIR' && docker-compose up db; exec bash" 2>/dev/null || \
        bash -c "cd '$SCRIPT_DIR' && docker-compose up db" &
        echo "Base de datos iniciada en nueva terminal"
    else
        echo "Error: Docker no disponible. Instale Docker para continuar."
        exit 1
    fi
else
    echo "Error: No se encontro docker-compose.yml"
    exit 1
fi

# 2) Esperar 15 segundos para que la base de datos este lista
echo "Esperando 15 segundos para que la base de datos este lista..."
sleep 15

# 3) Iniciar Spring Boot
if [ -f "$SCRIPT_DIR/springboot.sh" ]; then
    echo "Iniciando Spring Boot..."
    gnome-terminal --title="Spring Boot" -- bash -c "cd '$SCRIPT_DIR' && ./springboot.sh; exec bash" 2>/dev/null || \
    xterm -title "Spring Boot" -e "cd '$SCRIPT_DIR' && ./springboot.sh; bash" 2>/dev/null || \
    konsole --title "Spring Boot" -e bash -c "cd '$SCRIPT_DIR' && ./springboot.sh; exec bash" 2>/dev/null || \
    bash -c "cd '$SCRIPT_DIR' && ./springboot.sh" &
    echo "Spring Boot iniciado en nueva terminal"
else
    echo "Advertencia: springboot.sh no encontrado en la ruta actual."
fi

# 4) Esperar 10 segundos para que Spring Boot arranque
echo "Esperando 10 segundos para que Spring Boot arranque..."
sleep 10

# 5) Iniciar Angular si existe
if [ -d "$SCRIPT_DIR/picantito-Angular" ]; then
    echo "Iniciando Angular..."
    cd "$SCRIPT_DIR/picantito-Angular"
    if [ ! -d "node_modules" ]; then
        echo "Instalando dependencias de Angular..."
        npm install
    fi
    gnome-terminal --title="Angular Dev Server" -- bash -c "cd '$SCRIPT_DIR/picantito-Angular' && npm start; exec bash" 2>/dev/null || \
    xterm -title "Angular Dev Server" -e "cd '$SCRIPT_DIR/picantito-Angular' && npm start; bash" 2>/dev/null || \
    konsole --title "Angular Dev Server" -e bash -c "cd '$SCRIPT_DIR/picantito-Angular' && npm start; exec bash" 2>/dev/null || \
    bash -c "cd '$SCRIPT_DIR/picantito-Angular' && npm start" &
    cd "$SCRIPT_DIR"
    echo "Angular iniciado en nueva terminal"
else
    echo "Angular no encontrado, saltando inicio de Angular"
fi
