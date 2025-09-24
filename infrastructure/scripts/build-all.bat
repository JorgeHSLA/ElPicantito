@echo off
REM Script CMD/Batch para construir todas las aplicaciones
REM Ejecutar desde la raíz del proyecto: infrastructure\scripts\build-all.bat

echo 🏗️ Construyendo El Picantito - Todas las Aplicaciones

REM Construir Backend
echo 🔧 Construyendo Backend...
cd apps\backend
call mvnw.cmd clean package -DskipTests
if %ERRORLEVEL% neq 0 (
    echo ❌ Error construyendo Backend
    exit /b 1
)
cd ..\..
echo ✅ Backend construido correctamente

REM Construir Frontend
echo 🎨 Construyendo Frontend...
cd apps\frontend
call npm install
if %ERRORLEVEL% neq 0 (
    echo ❌ Error instalando dependencias del Frontend
    exit /b 1
)
call npx ng build --configuration production
if %ERRORLEVEL% neq 0 (
    echo ❌ Error construyendo Frontend
    exit /b 1
)
cd ..\..
echo ✅ Frontend construido correctamente

REM Preparar Chatbot
echo 🤖 Validando Chatbot...
cd apps\chatbot
pip install -r requirements.txt
if %ERRORLEVEL% neq 0 (
    echo ❌ Error instalando dependencias del Chatbot
    exit /b 1
)
cd ..\..
echo ✅ Chatbot validado correctamente

echo.
echo 🎉 Todas las aplicaciones construidas exitosamente!
echo 📦 Artefactos generados en:
echo    Backend:  apps\backend\target\
echo    Frontend: apps\frontend\dist\

pause