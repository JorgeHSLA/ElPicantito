# Script de configuración inicial para PC nueva
# Ejecutar desde la raiz del proyecto: .\setupnew.ps1

Write-Host "Configurando El Picantito en PC nueva..." -ForegroundColor Green

# Verificar Node.js
Write-Host "Verificando Node.js..." -ForegroundColor Cyan
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Node.js no esta instalado" -ForegroundColor Red
    Write-Host "Instala Node.js desde: https://nodejs.org" -ForegroundColor Yellow
    exit 1
}
$nodeVersion = node --version
Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green

# Verificar npm
Write-Host "Verificando npm..." -ForegroundColor Cyan
if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "Error: npm no esta disponible" -ForegroundColor Red
    exit 1
}
$npmVersion = npm --version
Write-Host "npm version: $npmVersion" -ForegroundColor Green

# Verificar Docker
Write-Host "Verificando Docker..." -ForegroundColor Cyan
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Docker no esta instalado" -ForegroundColor Red
    Write-Host "Instala Docker Desktop desde: https://docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

# Verificar si Docker esta corriendo
docker info >$null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Docker no esta ejecutandose" -ForegroundColor Red
    Write-Host "Inicia Docker Desktop y vuelve a ejecutar este script" -ForegroundColor Yellow
    exit 1
}
Write-Host "Docker esta funcionando correctamente" -ForegroundColor Green

# Instalar dependencias de Angular
Write-Host ""
Write-Host "Instalando dependencias de Angular..." -ForegroundColor Cyan
Set-Location "apps\frontend"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error instalando dependencias de npm" -ForegroundColor Red
    exit 1
}
Set-Location "..\.."
Write-Host "Dependencias de Angular instaladas correctamente" -ForegroundColor Green

# Iniciar base de datos
Write-Host ""
Write-Host "Iniciando base de datos PostgreSQL..." -ForegroundColor Cyan
Set-Location "infrastructure\docker"
docker-compose up -d postgres
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error iniciando PostgreSQL" -ForegroundColor Red
    exit 1
}
Set-Location "..\.."
Write-Host "PostgreSQL iniciado correctamente" -ForegroundColor Green

# Esperar que la DB este lista
Write-Host "Esperando que PostgreSQL este completamente listo..." -ForegroundColor Cyan
Start-Sleep -Seconds 15

# Iniciar Angular
Write-Host ""
Write-Host "Iniciando aplicacion Angular..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd apps\frontend; npx ng serve --open"

Write-Host ""
Write-Host "=== CONFIGURACION COMPLETADA ===" -ForegroundColor Green
Write-Host "El Picantito esta listo para desarrollo" -ForegroundColor Green
Write-Host ""
Write-Host "URLs disponibles:" -ForegroundColor Yellow
Write-Host "  Frontend:  http://localhost:4200" -ForegroundColor White
Write-Host "  Database:  localhost:5432" -ForegroundColor White
Write-Host "  PgAdmin:   http://localhost:5050 (admin@admin.com / admin)" -ForegroundColor White
Write-Host ""
Write-Host "Para siguientes sesiones, usa: .\infrastructure\scripts\start.ps1" -ForegroundColor Cyan