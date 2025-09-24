@echo off
REM Script CMD/Batch para iniciar todos los servicios en modo desarrollo
REM Ejecutar desde la raiz del proyecto: infrastructure\scripts\start.bat

echo Iniciando El Picantito - Angular + PostgreSQL

REM Verificar si Docker esta ejecutandose
docker info >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Docker no esta ejecutandose. Por favor, inicia Docker Desktop.
    pause
    exit /b 1
)

echo Iniciando base de datos con Docker...
cd infrastructure\docker
docker-compose up -d db
cd ..\..

echo Esperando a que la base de datos este lista...
timeout /t 10 /nobreak >nul

REM Iniciando Backend (DESHABILITADO - Solo desarrollo Angular + DB)
REM echo Iniciando Backend (Spring Boot)...
REM start "Backend" cmd /k "cd apps\backend && mvnw.cmd spring-boot:run"
REM timeout /t 5 /nobreak >nul

echo Iniciando Frontend (Angular)...
start "Frontend" cmd /k "cd apps\frontend && npm install && npx ng serve"

REM echo Iniciando Chatbot (Streamlit)...
REM start "Chatbot" cmd /k "cd apps\chatbot && pip install -r requirements.txt && streamlit run streamlit_app.py"

echo.
echo Servicios iniciados exitosamente
echo URLs de acceso:
echo    Frontend:  http://localhost:4200
echo    Database:  localhost:5432
echo.
echo Presiona cualquier tecla para cerrar este script (los servicios seguiran corriendo)...
pause >nul