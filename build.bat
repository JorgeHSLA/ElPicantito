@echo off
REM Script para instalar todas las dependencias - CMD

echo Instalando todas las dependencias del proyecto...

set ERROR_COUNT=0

REM Verificar Node.js y npm
echo 1. Verificando Node.js y npm...
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js y npm no estan instalados
    set /a ERROR_COUNT+=1
) else (
    npm --version >nul 2>&1
    if errorlevel 1 (
        echo Error: npm no esta instalado
        set /a ERROR_COUNT+=1
    ) else (
        echo Node.js y npm encontrados
    )
)

REM Instalar Angular CLI
echo 2. Instalando Angular CLI...
ng version >nul 2>&1
if errorlevel 1 (
    echo Instalando Angular CLI globalmente...
    npm install -g @angular/cli
    if errorlevel 1 (
        echo Error instalando Angular CLI
        set /a ERROR_COUNT+=1
    ) else (
        echo Angular CLI instalado correctamente
    )
) else (
    echo Angular CLI ya esta instalado
)

REM Verificar Java
echo 3. Verificando Java...
java -version >nul 2>&1
if errorlevel 1 (
    echo Error: Java no esta instalado
    set /a ERROR_COUNT+=1
) else (
    echo Java encontrado
)

REM Verificar Maven
echo 4. Verificando Maven...
if exist "mvnw.cmd" (
    echo Maven Wrapper encontrado
) else (
    mvn --version >nul 2>&1
    if errorlevel 1 (
        echo Error: Maven no esta instalado
        set /a ERROR_COUNT+=1
    ) else (
        echo Maven encontrado
    )
)

REM Verificar Docker
echo 5. Verificando Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo Error: Docker no esta instalado
    set /a ERROR_COUNT+=1
) else (
    docker-compose --version >nul 2>&1
    if errorlevel 1 (
        echo Error: docker-compose no esta instalado
        set /a ERROR_COUNT+=1
    ) else (
        echo Docker y docker-compose encontrados
    )
)

REM Instalar dependencias de Angular
if exist "picantito-Angular" (
    echo 6. Instalando dependencias de Angular...
    cd picantito-Angular
    npm install
    if errorlevel 1 (
        echo Error instalando dependencias de Angular
        set /a ERROR_COUNT+=1
    ) else (
        echo Dependencias de Angular instaladas correctamente
    )
    cd ..
) else (
    echo Advertencia: No se encontro carpeta picantito-Angular
)

REM Compilar Spring Boot
if exist "pom.xml" (
    echo 7. Compilando proyecto Spring Boot...
    if exist "mvnw.cmd" (
        mvnw.cmd clean compile
    ) else (
        mvn clean compile
    )
    if errorlevel 1 (
        echo Error compilando Spring Boot
        set /a ERROR_COUNT+=1
    ) else (
        echo Proyecto Spring Boot compilado correctamente
    )
) else (
    echo Advertencia: No se encontro pom.xml
)

REM Descargar imagenes de Docker
echo 8. Descargando imagenes de Docker...
docker pull postgres:16.1
if errorlevel 1 (
    echo Error descargando imagen de Docker
    set /a ERROR_COUNT+=1
) else (
    echo Imagen de PostgreSQL descargada
)

REM Resumen
echo.
echo Resumen de instalacion:
if %ERROR_COUNT%==0 (
    echo Todas las dependencias se instalaron correctamente!
    echo El proyecto esta listo para ejecutarse
) else (
    echo Se encontraron %ERROR_COUNT% errores durante la instalacion
)

echo.
echo Para iniciar los servicios use:
echo - angular.bat     (solo Angular)
echo - database.bat    (solo Base de datos)
echo - springboot.bat  (solo Spring Boot)
echo - angulardb.bat   (Angular + Base de datos)
pause