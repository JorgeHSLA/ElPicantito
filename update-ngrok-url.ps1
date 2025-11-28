# Script para actualizar la URL de ngrok en el archivo de environment
# Uso: .\update-ngrok-url.ps1 "https://tu-nueva-url.ngrok-free.app"

param(
    [Parameter(Mandatory=$true)]
    [string]$NgrokUrl
)

$envFile = "picantito-angular\src\environments\environment.prod.ts"

Write-Host "Actualizando URL de ngrok en $envFile..." -ForegroundColor Cyan

# Leer el archivo
$content = Get-Content $envFile -Raw

# Validar que la URL tenga el formato correcto
if ($NgrokUrl -notmatch '^https?://') {
    Write-Host "Error: La URL debe comenzar con http:// o https://" -ForegroundColor Red
    exit 1
}

# Quitar trailing slash si existe
$NgrokUrl = $NgrokUrl.TrimEnd('/')

# Reemplazar la URL
$newContent = $content -replace "apiUrl:\s*'[^']*'", "apiUrl: '$NgrokUrl'"

# Guardar el archivo
$newContent | Set-Content $envFile -NoNewline

Write-Host "URL actualizada correctamente" -ForegroundColor Green
Write-Host ""
Write-Host "Contenido actualizado:" -ForegroundColor Yellow
Write-Host $newContent -ForegroundColor Gray
Write-Host ""
Write-Host "Siguiente paso:" -ForegroundColor Cyan
Write-Host "1. git add $envFile" -ForegroundColor White
Write-Host "2. git commit -m 'Update ngrok URL'" -ForegroundColor White
Write-Host "3. git push origin main" -ForegroundColor White
Write-Host ""
Write-Host "Vercel se actualizara automaticamente en 2-3 minutos" -ForegroundColor Green
