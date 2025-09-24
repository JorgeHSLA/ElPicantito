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

echo ""
echo "=== CONFIGURACION COMPLETADA ==="
echo "Todas las dependencias instaladas correctamente"
echo ""
echo "Para iniciar el proyecto, usa:"
echo "  ./infrastructure/scripts/start.sh"
echo ""
echo "URLs que estaran disponibles al iniciar:"
echo "  Frontend:  http://localhost:4200"
echo "  Database:  localhost:5432"
echo "  PgAdmin:   http://localhost:5050 (admin@admin.com / admin)"