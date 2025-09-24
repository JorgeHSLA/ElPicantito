@echo off
REM Script CMD/Batch para construir todas las aplicaciones
REM Ejecutar desde la raiz del proyecto: infrastructure\scripts\build.bat

echo Construyendo El Picantito - Todas las Aplicaciones

REM Construir Backend (deshabilitado por ahora)
REM echo Construyendo Backend...
REM cd apps\backend
REM call mvnw.cmd clean package -DskipTests
REM if %ERRORLEVEL% neq 0 (
REM     echo Error construyendo Backend
REM     exit /b 1
REM )
REM cd ..\..
REM echo Backend construido correctamente

REM Construir Frontend
echo Construyendo Frontend...
cd apps\frontend
call npm install
if %ERRORLEVEL% neq 0 (
    echo Error instalando dependencias del Frontend
    exit /b 1
)
call npx ng build --configuration production
if %ERRORLEVEL% neq 0 (
    echo Error construyendo Frontend
    exit /b 1
)
cd ..\..
echo Frontend construido correctamente

REM Preparar Chatbot (deshabilitado por ahora)
REM echo Validando Chatbot...
REM cd apps\chatbot
REM pip install -r requirements.txt
REM if %ERRORLEVEL% neq 0 (
REM     echo Error instalando dependencias del Chatbot
REM     exit /b 1
REM )
REM cd ..\..
REM echo Chatbot validado correctamente

echo.
echo Frontend construido exitosamente
echo Artefactos generados en:
echo    Frontend: apps\frontend\dist\

pause