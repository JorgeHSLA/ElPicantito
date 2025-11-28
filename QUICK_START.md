# 🚀 Inicio Rápido - Backend con ngrok

## Para iniciar el backend públicamente:

```powershell
.\start-backend-ngrok.ps1
```

Este comando:
- ✅ Inicia Docker Compose (backend + PostgreSQL)
- ✅ Configura ngrok automáticamente
- ✅ Te proporciona una URL pública
- ✅ Guarda la URL en `ngrok-url.txt`

## Después de obtener la URL:

1. **Actualiza el environment del frontend:**
   ```powershell
   .\update-ngrok-url.ps1 "https://tu-url.ngrok-free.app"
   ```

2. **Haz commit y push:**
   ```powershell
   git add picantito-angular/src/environments/environment.prod.ts
   git commit -m "Update ngrok backend URL"
   git push origin main
   ```

3. **¡Listo!** Vercel se actualizará automáticamente en 2-3 minutos

## 📚 Para más detalles:

Lee la [Guía Completa de Despliegue](DEPLOYMENT_GUIDE.md)

## 🛑 Para detener:

Presiona `Ctrl+C` en la ventana donde está corriendo el script
