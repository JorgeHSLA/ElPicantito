# Script de verificacion JWT
$baseUrl = 'http://localhost:9998'

Write-Host '=== PRUEBA 1: Verificar aplicacion ===' -ForegroundColor Cyan
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/actuator/health" -Method Get
    Write-Host 'OK: Aplicacion activa' -ForegroundColor Green
} catch {
    Write-Host 'ERROR: Aplicacion no esta corriendo' -ForegroundColor Red
    exit 1
}

Write-Host '=== PRUEBA 2: Login y obtener token JWT ===' -ForegroundColor Cyan
$loginBody = @{ nombreUsuario = 'admin'; contrasenia = 'admin123' } | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/usuarios/login" -Method Post -ContentType 'application/json' -Body $loginBody
    $token = $response.token
    Write-Host 'OK: Login exitoso' -ForegroundColor Green
    Write-Host "  Usuario: $($response.nombreUsuario)"
    Write-Host "  Roles: $($response.roles)"
    Write-Host "  Token: $($token.Substring(0, 50))..."
} catch {
    Write-Host 'ERROR en login' -ForegroundColor Red
    exit 1
}

Write-Host '=== PRUEBA 3: Acceso SIN token ===' -ForegroundColor Cyan
try {
    Invoke-RestMethod -Uri "$baseUrl/api/productos" -Method Get
    Write-Host 'ERROR: Se accedio sin token' -ForegroundColor Red
} catch {
    Write-Host 'OK: Acceso denegado sin token' -ForegroundColor Green
}

Write-Host '=== PRUEBA 4: Acceso CON token ===' -ForegroundColor Cyan
try {
    $headers = @{ 'Authorization' = "Bearer $token" }
    $productos = Invoke-RestMethod -Uri "$baseUrl/api/productos" -Method Get -Headers $headers
    Write-Host 'OK: Acceso exitoso con token' -ForegroundColor Green
} catch {
    Write-Host 'ERROR al acceder con token' -ForegroundColor Red
}

Write-Host '=== PRUEBA 5: Logout ===' -ForegroundColor Cyan
try {
    $headers = @{ 'Authorization' = "Bearer $token" }
    Invoke-RestMethod -Uri "$baseUrl/api/usuarios/logout" -Method Post -Headers $headers
    Write-Host 'OK: Logout exitoso' -ForegroundColor Green
} catch {
    Write-Host 'ERROR en logout' -ForegroundColor Red
}

Write-Host '=== PRUEBA 6: Token despues de logout ===' -ForegroundColor Cyan
Start-Sleep -Seconds 1
try {
    $headers = @{ 'Authorization' = "Bearer $token" }
    Invoke-RestMethod -Uri "$baseUrl/api/productos" -Method Get -Headers $headers
    Write-Host 'ERROR: Token revocado aun funciona' -ForegroundColor Red
} catch {
    Write-Host 'OK: Token revocado correctamente' -ForegroundColor Green
}

Write-Host ''
Write-Host 'TODAS LAS PRUEBAS COMPLETADAS' -ForegroundColor Cyan
