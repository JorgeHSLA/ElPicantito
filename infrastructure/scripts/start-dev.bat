@echo off
REM Script CMD/Batch para iniciar todos los servicios en modo desarrollo
REM Ejecutar desde la raíz del proyecto: infrastructure\scripts\start-dev.bat

echo 🌮 Iniciando El Picantito - Desarrollo Completo

REM Verificar si Docker está ejecutándose
docker info >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Docker no está ejecutándose. Por favor, inicia Docker Desktop.
    pause
    exit /b 1
)

echo 🐳 Iniciando base de datos con Docker...
cd infrastructure\docker
docker-compose up -d db
cd ..\..

echo ⏳ Esperando a que la base de datos esté lista...
timeout /t 10 /nobreak >nul

echo 🔧 Iniciando Backend (Spring Boot)...
start "Backend" cmd /k "cd apps\backend && mvnw.cmd spring-boot:run"

echo ⏳ Esperando 5 segundos antes de iniciar frontend...
timeout /t 5 /nobreak >nul

echo 🎨 Iniciando Frontend (Angular)...
start "Frontend" cmd /k "cd apps\frontend && npm install && npx ng serve"

echo 🤖 Iniciando Chatbot (Streamlit)...
start "Chatbot" cmd /k "cd apps\chatbot && pip install -r requirements.txt && streamlit run streamlit_app.py"

echo.
echo ✅ Servicios iniciados exitosamente!
echo 🌐 URLs de acceso:
echo    Frontend:  http://localhost:4200
echo    Backend:   http://localhost:9998
echo    Chatbot:   http://localhost:8501
echo    Database:  localhost:5432
echo.
echo Presiona cualquier tecla para cerrar este script (los servicios seguirán corriendo)...
pause >nul