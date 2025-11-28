# Script para iniciar el backend con ngrok
# Este script:
# 1. Inicia Docker Compose con el backend y la base de datos
# 2. Configura ngrok con tu authtoken
# 3. Crea un túnel público hacia el backend
# 4. Guarda la URL pública para configurar en Vercel

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ElPicantito - Backend con ngrok" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Variables
$NGROK_AUTHTOKEN = "365PLNuGiTRb7Di5W015yVCr1BA_6Ant1SFyUmUe7LKfLagVd"
$BACKEND_PORT = "9998"
$NGROK_CONFIG_FILE = "$env:USERPROFILE\.ngrok2\ngrok.yml"

# Función para limpiar al salir
function Cleanup {
    Write-Host "`n`nDeteniendo servicios..." -ForegroundColor Yellow
    docker-compose -f docker-compose-backend.yml down
    Write-Host "Servicios detenidos." -ForegroundColor Green
}

# Registrar la función de limpieza para Ctrl+C
Register-EngineEvent PowerShell.Exiting -Action { Cleanup }

# Paso 1: Configurar ngrok authtoken
Write-Host "Paso 1: Configurando ngrok authtoken..." -ForegroundColor Yellow
try {
    ngrok config add-authtoken $NGROK_AUTHTOKEN
    Write-Host "Authtoken configurado correctamente" -ForegroundColor Green
} 
catch {
    Write-Host "Error al configurar authtoken. Verifica que ngrok este instalado." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Paso 2: Iniciar Docker Compose
Write-Host "Paso 2: Iniciando backend y base de datos..." -ForegroundColor Yellow
Write-Host "Esto puede tomar unos minutos la primera vez..." -ForegroundColor Gray

docker-compose -f docker-compose-backend.yml up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error al iniciar Docker Compose" -ForegroundColor Red
    exit 1
}

Write-Host "Contenedores iniciados" -ForegroundColor Green
Write-Host ""

# Paso 3: Esperar a que el backend este listo
Write-Host "Paso 3: Esperando a que el backend este listo..." -ForegroundColor Yellow
$maxRetries = 30
$retryCount = 0
$backendReady = $false

while (-not $backendReady -and $retryCount -lt $maxRetries) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$BACKEND_PORT/api/productos" -Method GET -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 401) {
            $backendReady = $true
            Write-Host "Backend esta listo!" -ForegroundColor Green
        }
    } catch {
        $retryCount++
        Write-Host "  Esperando... ($retryCount/$maxRetries)" -ForegroundColor Gray
        Start-Sleep -Seconds 2
    }
}

if (-not $backendReady) {
    Write-Host "El backend no respondio a tiempo. Revisa los logs con:" -ForegroundColor Red
    Write-Host "  docker-compose -f docker-compose-backend.yml logs" -ForegroundColor Yellow
    Cleanup
    exit 1
}

Write-Host ""

# Paso 4: Iniciar ngrok
Write-Host "Paso 4: Iniciando tunel ngrok..." -ForegroundColor Yellow
Write-Host ""

# Iniciar ngrok en segundo plano
$ngrokJob = Start-Job -ScriptBlock {
    param($port)
    ngrok http $port
} -ArgumentList $BACKEND_PORT

Start-Sleep -Seconds 3

# Obtener la URL pública de ngrok
try {
    $ngrokApi = Invoke-RestMethod -Uri "http://localhost:4040/api/tunnels" -Method GET
    $publicUrl = $ngrokApi.tunnels[0].public_url
    
    if ($publicUrl) {
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  TUNEL NGROK ACTIVO!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "URL Publica: " -NoNewline -ForegroundColor Cyan
        Write-Host $publicUrl -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Configuracion para Vercel:" -ForegroundColor Cyan
        Write-Host "1. Ve a tu fork: https://github.com/javigk01/ElPicantito" -ForegroundColor White
        Write-Host "2. Ejecuta el script: .\update-ngrok-url.ps1 `"$publicUrl`"" -ForegroundColor White
        Write-Host "3. Haz commit y push - Vercel se actualizara automaticamente" -ForegroundColor White
        Write-Host ""
        
        # Guardar URL en archivo para referencia
        $publicUrl | Out-File -FilePath "ngrok-url.txt" -Encoding UTF8
        Write-Host "URL guardada en ngrok-url.txt" -ForegroundColor Green
        Write-Host ""
        
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  SERVICIOS ACTIVOS" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "Backend local:  http://localhost:$BACKEND_PORT" -ForegroundColor White
        Write-Host "Backend publico: $publicUrl" -ForegroundColor Yellow
        Write-Host "Ngrok Dashboard: http://localhost:4040" -ForegroundColor White
        Write-Host "Frontend Vercel: https://el-picantito.vercel.app" -ForegroundColor White
        Write-Host ""
        Write-Host "Presiona Ctrl+C para detener todos los servicios" -ForegroundColor Gray
        Write-Host ""
        
        # Mantener el script corriendo
        try {
            while ($true) {
                Start-Sleep -Seconds 1
            }
        }
        catch {
            Write-Host "Interrumpido por el usuario" -ForegroundColor Yellow
        }
        finally {
            Cleanup
        }
        
    } 
    else {
        Write-Host "Error: No se pudo obtener la URL de ngrok" -ForegroundColor Red
        Cleanup
        exit 1
    }
} 
catch {
    Write-Host "Error al conectar con ngrok API: $_" -ForegroundColor Red
    Write-Host "Verifica que ngrok este corriendo correctamente" -ForegroundColor Yellow
    Cleanup
    exit 1
}
