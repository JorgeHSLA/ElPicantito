#!/bin/bash
# Script para correr base de datos - Linux

echo "Iniciando secuencia: Spring Boot -> (espera 10s) -> Base de datos -> Angular (si existe)..."

# 1) Iniciar Spring Boot en nueva terminal si existe el script
if [ -f "springboot.sh" ]; then
    echo "Iniciando Spring Boot (springboot.sh)..."
    gnome-terminal --title="Spring Boot" -- bash -c "./springboot.sh; exec bash" 2>/dev/null || \
    xterm -title "Spring Boot" -e "./springboot.sh; bash" 2>/dev/null || \
    konsole --title "Spring Boot" -e bash -c "./springboot.sh; exec bash" 2>/dev/null || \
    bash -c "./springboot.sh" &
else
    echo "Advertencia: springboot.sh no encontrado. No se iniciara Spring Boot automaticamente."
fi

# Esperar 10 segundos antes de iniciar la base de datos
sleep 10

# 2) Iniciar base de datos
echo "Iniciando base de datos..."
if [ ! -f "docker-compose.yml" ]; then
    echo "Error: No se encontro docker-compose.yml"
    exit 1
fi

echo "Verificando Docker..."
if ! command -v docker &> /dev/null; then
    echo "Error: Docker no esta instalado"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "Error: docker-compose no esta instalado"
    exit 1
fi

echo "Iniciando contenedor de base de datos..."
gnome-terminal --title="Database Container" -- bash -c "docker-compose up db; exec bash" 2>/dev/null || \
xterm -title "Database Container" -e "docker-compose up db; bash" 2>/dev/null || \
konsole --title "Database Container" -e bash -c "docker-compose up db; exec bash" 2>/dev/null || \
bash -c "docker-compose up db" &

echo "Base de datos se esta iniciando en una nueva terminal..."
echo "PostgreSQL estara disponible en: localhost:5432"
echo "Base de datos: picantitodb"
echo "Usuario: taquito"

# 3) Si existe Angular, iniciarlo ahora
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
    echo "Angular (si existia) lanzado en nueva terminal"
else
    echo "Angular no encontrado, saltando inicio de Angular"
fi