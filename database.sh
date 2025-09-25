#!/bin/bash
# Script para correr base de datos - Linux

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