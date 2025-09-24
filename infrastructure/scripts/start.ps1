# Script PowerShell para iniciar todos los servicios en modo desarrollo
# Ejecutar desde la raiz del proyecto: .\infrastructure\scripts\start.ps1

Write-Host "Iniciando El Picantito - Desarrollo Completo" -ForegroundColor Green

# Verificar si Docker esta ejecutandose
$dockerRunning = docker info 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker no esta ejecutandose. Por favor, inicia Docker Desktop." -ForegroundColor Red
    exit 1
}

Write-Host "Iniciando base de datos con Docker..." -ForegroundColor Yellow
Set-Location "infrastructure\docker"
docker-compose up -d db
Set-Location "..\.."

# Esperar a que la base de datos este lista
Write-Host "Esperando a que la base de datos este lista..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Iniciar Backend
Write-Host "Iniciando Backend (Spring Boot)..." -ForegroundColor Blue
if ($IsWindows -or $env:OS -eq "Windows_NT") {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd apps\backend; .\mvnw.cmd spring-boot:run"
} else {
    Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd apps/backend; ./mvnw spring-boot:run"
}

# Esperar un poco antes de iniciar el frontend
Start-Sleep -Seconds 5

# Iniciar Frontend
Write-Host "Iniciando Frontend (Angular)..." -ForegroundColor Cyan
if ($IsWindows -or $env:OS -eq "Windows_NT") {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd apps\frontend; npm install; npx ng serve"
} else {
    Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd apps/frontend; npm install; npx ng serve"
}

# Iniciar Chatbot (deshabilitado por ahora)
# Write-Host "Iniciando Chatbot (Streamlit)..." -ForegroundColor Magenta
# if ($IsWindows -or $env:OS -eq "Windows_NT") {
#     Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd apps\chatbot; pip install -r requirements.txt; streamlit run streamlit_app.py"
# } else {
#     Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd apps/chatbot; pip3 install -r requirements.txt; streamlit run streamlit_app.py"
# }

Write-Host ""
Write-Host "Servicios iniciados exitosamente" -ForegroundColor Green
Write-Host "URLs de acceso:" -ForegroundColor White
Write-Host "   Frontend:  http://localhost:4200" -ForegroundColor Cyan
Write-Host "   Backend:   http://localhost:9998" -ForegroundColor Blue
Write-Host "   Database:  localhost:5432" -ForegroundColor Yellow
Write-Host ""
Write-Host "Presiona Ctrl+C para detener los servicios"