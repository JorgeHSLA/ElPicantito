#!/bin/bash
# Script Bash para construir todas las aplicaciones
# Ejecutar desde la raiz del proyecto: ./infrastructure/scripts/build.sh

echo "Construyendo El Picantito - Todas las Aplicaciones"

set -e  # Salir si hay algun error

# Construir Backend
echo "Construyendo Backend..."
cd apps/backend
./mvnw clean package -DskipTests
cd ../..
echo "Backend construido correctamente"

# Construir Frontend
echo "Construyendo Frontend..."
cd apps/frontend
npm install
npx ng build --configuration production
cd ../..
echo "Frontend construido correctamente"

# Preparar Chatbot
echo "Validando Chatbot..."
cd apps/chatbot
pip3 install -r requirements.txt
cd ../..
echo "Chatbot validado correctamente"

echo ""
echo "Todas las aplicaciones construidas exitosamente"
echo "Artefactos generados en:"
echo "   Backend:  apps/backend/target/"
echo "   Frontend: apps/frontend/dist/"