#!/bin/bash
# Script para instalar todas las dependencias - Linux

echo "Instalando todas las dependencias del proyecto..."

ERROR_COUNT=0

# Verificar Node.js y npm
echo "1. Verificando Node.js y npm..."
if ! command -v node &> /dev/null; then
    echo "Error: Node.js no esta instalado"
    ((ERROR_COUNT++))
elif ! command -v npm &> /dev/null; then
    echo "Error: npm no esta instalado"
    ((ERROR_COUNT++))
else
    echo "Node.js y npm encontrados"
fi

# Instalar Angular CLI
echo "2. Instalando Angular CLI..."
if ! command -v ng &> /dev/null; then
    echo "Instalando Angular CLI globalmente..."
    if npm install -g @angular/cli; then
        echo "Angular CLI instalado correctamente"
    else
        echo "Error instalando Angular CLI"
        ((ERROR_COUNT++))
    fi
else
    echo "Angular CLI ya esta instalado"
fi

# Verificar Java
echo "3. Verificando Java..."
if ! command -v java &> /dev/null; then
    echo "Error: Java no esta instalado"
    ((ERROR_COUNT++))
else
    echo "Java encontrado"
fi

# Verificar Maven
echo "4. Verificando Maven..."
if [ -f "mvnw" ]; then
    echo "Maven Wrapper encontrado"
    chmod +x mvnw
elif ! command -v mvn &> /dev/null; then
    echo "Error: Maven no esta instalado"
    ((ERROR_COUNT++))
else
    echo "Maven encontrado"
fi

# Verificar Docker
echo "5. Verificando Docker..."
if ! command -v docker &> /dev/null; then
    echo "Error: Docker no esta instalado"
    ((ERROR_COUNT++))
elif ! command -v docker-compose &> /dev/null; then
    echo "Error: docker-compose no esta instalado"
    ((ERROR_COUNT++))
else
    echo "Docker y docker-compose encontrados"
fi

# Instalar dependencias de Angular
if [ -d "picantito-Angular" ]; then
    echo "6. Instalando dependencias de Angular..."
    cd picantito-Angular
    if npm install; then
        echo "Dependencias de Angular instaladas correctamente"
    else
        echo "Error instalando dependencias de Angular"
        ((ERROR_COUNT++))
    fi
    cd ..
else
    echo "Advertencia: No se encontro carpeta picantito-Angular"
fi

# Compilar Spring Boot
if [ -f "pom.xml" ]; then
    echo "7. Compilando proyecto Spring Boot..."
    if [ -f "mvnw" ]; then
        MVN_CMD="./mvnw"
    else
        MVN_CMD="mvn"
    fi
    
    if $MVN_CMD clean compile; then
        echo "Proyecto Spring Boot compilado correctamente"
    else
        echo "Error compilando Spring Boot"
        ((ERROR_COUNT++))
    fi
else
    echo "Advertencia: No se encontro pom.xml"
fi

# Descargar imagenes de Docker
echo "8. Descargando imagenes de Docker..."
if docker pull postgres:16.1; then
    echo "Imagen de PostgreSQL descargada"
else
    echo "Error descargando imagen de Docker"
    ((ERROR_COUNT++))
fi

# Hacer ejecutables los scripts de shell
echo "9. Configurando permisos de scripts..."
chmod +x *.sh 2>/dev/null

# Resumen
echo ""
echo "Resumen de instalacion:"
if [ $ERROR_COUNT -eq 0 ]; then
    echo "Todas las dependencias se instalaron correctamente!"
    echo "El proyecto esta listo para ejecutarse"
else
    echo "Se encontraron $ERROR_COUNT errores durante la instalacion"
fi

echo ""
echo "Para iniciar los servicios use:"
echo "- ./angular.sh     (solo Angular)"
echo "- ./database.sh    (solo Base de datos)"
echo "- ./springboot.sh  (solo Spring Boot)"
echo "- ./angulardb.sh   (Angular + Base de datos)"