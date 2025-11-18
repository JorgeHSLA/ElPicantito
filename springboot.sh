#!/bin/bash
# Script para correr Spring Boot - Linux

echo "Iniciando aplicacion Spring Boot..."

if [ ! -f "pom.xml" ]; then
    echo "Error: No se encontro pom.xml"
    exit 1
fi

# Cargar variables de entorno desde .env si existe
if [ -f ".env" ]; then
    echo "Cargando variables de entorno desde .env..."
    export $(grep -v '^#' .env | xargs)
fi

echo "Verificando Maven..."
if [ -f "mvnw" ]; then
    echo "Usando Maven Wrapper..."
    MVN_CMD="./mvnw"
    chmod +x mvnw
else
    if ! command -v mvn &> /dev/null; then
        echo "Error: Maven no esta instalado"
        exit 1
    fi
    MVN_CMD="mvn"
fi

echo "Compilando y ejecutando Spring Boot..."
gnome-terminal --title="Spring Boot App" -- bash -c "$MVN_CMD spring-boot:run; exec bash" 2>/dev/null || \
xterm -title "Spring Boot App" -e "$MVN_CMD spring-boot:run; bash" 2>/dev/null || \
konsole --title "Spring Boot App" -e bash -c "$MVN_CMD spring-boot:run; exec bash" 2>/dev/null || \
bash -c "$MVN_CMD spring-boot:run" &

echo "Spring Boot se esta iniciando en una nueva terminal..."
echo "API estara disponible en: http://localhost:8080"