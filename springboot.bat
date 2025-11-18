@echo off
REM Script para correr Spring Boot - CMD

echo Iniciando aplicacion Spring Boot...

if not exist "pom.xml" (
    echo Error: No se encontro pom.xml
    pause
    exit /b 1
)

REM Cargar variables de entorno desde .env si existe
if exist ".env" (
    echo Cargando variables de entorno desde .env...
    for /f "usebackq tokens=1,* delims==" %%a in (".env") do (
        echo %%a | findstr /r "^[^#]" >nul
        if not errorlevel 1 set %%a=%%b
    )
)

echo Verificando Maven...
if exist "mvnw.cmd" (
    echo Usando Maven Wrapper...
    set MVN_CMD=mvnw.cmd
) else (
    mvn --version >nul 2>&1
    if errorlevel 1 (
        echo Error: Maven no esta instalado
        pause
        exit /b 1
    )
    set MVN_CMD=mvn
)

echo Compilando y ejecutando Spring Boot...
start "Spring Boot App" cmd /k "%MVN_CMD% spring-boot:run"

echo Spring Boot se esta iniciando en una nueva ventana...
echo API estara disponible en: http://localhost:8080
pause