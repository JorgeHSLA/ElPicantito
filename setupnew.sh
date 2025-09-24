#!/bin/bash
# Script de configuracion inicial para PC nueva
# Ejecutar desde la raiz del proyecto: ./setupnew.sh

echo "Configurando El Picantito en PC nueva..."

# Verificar Node.js
echo "Verificando Node.js..."
if ! command -v node >/dev/null 2>&1; then
    echo "Error: Node.js no esta instalado"
    echo "Instala Node.js desde: https://nodejs.org"
    exit 1
fi
nodeVersion=$(node --version)
echo "Node.js version: $nodeVersion"

# Verificar npm
echo "Verificando npm..."
if ! command -v npm >/dev/null 2>&1; then
    echo "Error: npm no esta disponible"
    exit 1
fi
npmVersion=$(npm --version)
echo "npm version: $npmVersion"

# Verificar Docker
echo "Verificando Docker..."
if ! command -v docker >/dev/null 2>&1; then
    echo "Error: Docker no esta instalado"
    echo "Instala Docker desde: https://docker.com/products/docker-desktop"
    exit 1
fi

# Verificar si Docker esta corriendo
if ! docker info >/dev/null 2>&1; then
    echo "Error: Docker no esta ejecutandose"
    echo "Inicia Docker y vuelve a ejecutar este script"
    exit 1
fi
echo "Docker esta funcionando correctamente"

# Instalar dependencias de Angular
echo ""
echo "Instalando dependencias de Angular..."
cd apps/frontend
npm install
if [ $? -ne 0 ]; then
    echo "Error instalando dependencias de npm"
    exit 1
fi
cd ../..
echo "Dependencias de Angular instaladas correctamente"

# Iniciar base de datos
echo ""
echo "Iniciando base de datos PostgreSQL..."
cd infrastructure/docker
docker-compose up -d postgres
if [ $? -ne 0 ]; then
    echo "Error iniciando PostgreSQL"
    exit 1
fi
cd ../..
echo "PostgreSQL iniciado correctamente"

# Esperar que la DB este lista
echo "Esperando que PostgreSQL este completamente listo..."
sleep 15

# Iniciar Angular
echo ""
echo "Iniciando aplicacion Angular..."
if command -v gnome-terminal >/dev/null 2>&1; then
    gnome-terminal --title="Angular" -- bash -c "cd apps/frontend && npx ng serve --open; read -p 'Presiona Enter para cerrar...'"
elif command -v xterm >/dev/null 2>&1; then
    xterm -title "Angular" -e "cd apps/frontend && npx ng serve --open; read -p 'Presiona Enter para cerrar...'" &
elif command -v open >/dev/null 2>&1; then  # macOS
    osascript -e 'tell app "Terminal" to do script "cd '$(pwd)'/apps/frontend && npx ng serve --open"'
else
    echo "Abriendo Angular manualmente..."
    cd apps/frontend
    npx ng serve --open &
    cd ../..
fi

echo ""
echo "=== CONFIGURACION COMPLETADA ==="
echo "El Picantito esta listo para desarrollo"
echo ""
echo "URLs disponibles:"
echo "  Frontend:  http://localhost:4200"
echo "  Database:  localhost:5432"
echo "  PgAdmin:   http://localhost:5050 (admin@admin.com / admin)"
echo ""
echo "Para siguientes sesiones, usa: ./infrastructure/scripts/start.sh"