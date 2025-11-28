# 🌮 Guía de Despliegue - El Picantito con ngrok

Esta guía te ayudará a desplegar el backend de El Picantito localmente con acceso público mediante ngrok, mientras el frontend está en Vercel.

## 📋 Requisitos Previos

- ✅ Docker Desktop instalado y corriendo
- ✅ ngrok instalado (ya configurado)
- ✅ PowerShell (Windows)
- ✅ Git (para hacer commits al fork)

## 🚀 Paso 1: Iniciar el Backend con ngrok

1. Abre PowerShell en la raíz del proyecto
2. Ejecuta el script de inicio:

```powershell
.\start-backend-ngrok.ps1
```

El script hará lo siguiente:
- ✨ Configurará ngrok con tu authtoken
- 🐳 Iniciará Docker Compose con el backend y PostgreSQL
- ⏳ Esperará a que el backend esté listo
- 🌐 Creará un túnel público con ngrok
- 📝 Te mostrará la URL pública del backend

**Ejemplo de salida:**
```
========================================
  ¡TÚNEL NGROK ACTIVO!
========================================

URL Pública: https://abc123.ngrok-free.app

Backend local:  http://localhost:9998
Backend público: https://abc123.ngrok-free.app
Ngrok Dashboard: http://localhost:4040
Frontend Vercel: https://el-picantito.vercel.app
```

⚠️ **IMPORTANTE:** Deja esta ventana de PowerShell abierta mientras uses la aplicación. Si la cierras, el túnel se detendrá.

## 🔧 Paso 2: Configurar el Frontend en tu Fork

### Opción A: Editar directamente en GitHub (Más rápido)

1. Ve a tu fork: https://github.com/javigk01/ElPicantito
2. Navega a `picantito-angular/src/environments/environment.prod.ts`
3. Haz clic en el botón de editar (ícono de lápiz)
4. Reemplaza `TU_URL_NGROK_AQUI` con la URL que te dio el script
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'https://abc123.ngrok-free.app'  // Tu URL de ngrok
   };
   ```
5. Haz commit directamente en GitHub

### Opción B: Editar localmente

1. Abre el archivo `picantito-angular/src/environments/environment.prod.ts`
2. Reemplaza `TU_URL_NGROK_AQUI` con tu URL de ngrok:
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'https://abc123.ngrok-free.app'  // Tu URL de ngrok
   };
   ```
3. Guarda el archivo
4. Haz commit y push:
   ```powershell
   git add picantito-angular/src/environments/environment.prod.ts
   git commit -m "Configure ngrok backend URL"
   git push origin main
   ```

## 📱 Paso 3: Actualizar los Servicios (Opcional pero Recomendado)

Para que los servicios del frontend usen la configuración de environment automáticamente:

1. En tu fork de GitHub, ve a cada archivo de servicio en `picantito-angular/src/app/services/`
2. Reemplaza las URLs hardcodeadas por la variable de entorno:

**Ejemplo - antes:**
```typescript
private readonly API_URL = 'http://localhost:9998/api/productos';
```

**Ejemplo - después:**
```typescript
import { environment } from '../../../environments/environment';

private readonly API_URL = `${environment.apiUrl}/api/productos`;
```

**Servicios a actualizar:**
- `tienda/producto.service.ts`
- `tienda/pedido-rest.service.ts`
- `verification.service.ts`
- Y cualquier otro servicio que use URLs del backend

3. Haz commit y push de los cambios

## ✅ Paso 4: Verificar el Despliegue

1. **Espera 2-3 minutos** a que Vercel redesplegue automáticamente
2. Ve a https://el-picantito.vercel.app/home
3. Verifica que:
   - ✅ Los productos se cargan correctamente
   - ✅ Puedes hacer login/registro
   - ✅ Las funcionalidades del backend funcionan

### Solución de Problemas

Si ves errores de CORS o conexión:

1. **Verifica que ngrok esté corriendo:**
   - Abre http://localhost:4040 en tu navegador
   - Deberías ver el dashboard de ngrok con tráfico

2. **Verifica que el backend esté corriendo:**
   ```powershell
   docker ps
   ```
   Deberías ver los contenedores `elpicantito-spring` y `ElPicantitoDB`

3. **Revisa los logs del backend:**
   ```powershell
   docker-compose -f docker-compose-backend.yml logs -f springboot
   ```

4. **Prueba el backend directamente:**
   - Abre tu URL de ngrok en el navegador: `https://tu-url.ngrok-free.app/api/productos`
   - Deberías ver la lista de productos (o un error 401 si requiere auth)

## 🔄 Cada vez que necesites usar la aplicación

1. Ejecuta el script:
   ```powershell
   .\start-backend-ngrok.ps1
   ```

2. **IMPORTANTE:** La URL de ngrok cambia cada vez que reinicias el túnel en el plan gratuito
   - Anota la nueva URL
   - Actualiza `environment.prod.ts` en tu fork
   - Espera a que Vercel redesplegue

### Mantener la misma URL (Opcional - Requiere ngrok Pro)

Si quieres una URL permanente, puedes actualizar a ngrok Pro y usar dominios estáticos. Con el plan gratuito, la URL cambiará en cada reinicio.

## 🛑 Detener los Servicios

Simplemente presiona `Ctrl+C` en la ventana de PowerShell donde está corriendo el script.

El script automáticamente:
- Detendrá el túnel de ngrok
- Detendrá los contenedores de Docker
- Limpiará los recursos

## 📊 Monitoreo

Mientras el backend esté corriendo, puedes:

- **Ver tráfico en tiempo real:** http://localhost:4040
- **Ver logs del backend:**
  ```powershell
  docker-compose -f docker-compose-backend.yml logs -f springboot
  ```
- **Ver logs de la base de datos:**
  ```powershell
  docker-compose -f docker-compose-backend.yml logs -f db
  ```

## 🔐 Seguridad

⚠️ **Ten en cuenta:**
- Tu backend estará públicamente accesible mientras ngrok esté corriendo
- Cualquiera con la URL puede acceder a tu API
- No compartas la URL de ngrok en lugares públicos
- Los datos en tu base de datos local pueden ser modificados
- Considera usar ngrok con autenticación básica si es necesario

## 💡 Tips

1. **URL guardada:** La URL de ngrok se guarda automáticamente en `ngrok-url.txt` para referencia
2. **Múltiples sesiones:** Puedes tener múltiples ventanas del dashboard de ngrok en diferentes puertos
3. **Desarrollo local:** Para desarrollo local, sigue usando `http://localhost:9998`

## 🆘 Soporte

Si encuentras problemas:
1. Revisa los logs con los comandos mencionados arriba
2. Verifica que Docker Desktop esté corriendo
3. Asegúrate de que el puerto 9998 no esté ocupado
4. Verifica que ngrok esté correctamente instalado

---

**¡Listo!** 🎉 Tu backend está corriendo públicamente y tu frontend en Vercel puede conectarse a él.
