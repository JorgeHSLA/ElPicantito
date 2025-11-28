# 🚀 Guía de Despliegue de Chatbots en Streamlit Cloud

Esta guía te ayudará a desplegar los dos chatbots de El Picantito en Streamlit Cloud de forma gratuita y permanente.

---

## 📋 REQUISITOS PREVIOS

### 1. Cuenta de GitHub
- Ya tienes tu fork: https://github.com/javigk01/ElPicantito ✅

### 2. Cuenta de Streamlit Cloud
- Ve a: https://share.streamlit.io/
- Haz clic en "Sign up" (esquina superior derecha)
- Selecciona "Continue with GitHub"
- Autoriza a Streamlit Cloud para acceder a tus repositorios
- ✅ **Cuenta creada gratis**

### 3. API Keys de OpenRouter (para los chatbots)
- Ve a: https://openrouter.ai/
- Crea una cuenta si no tienes
- Ve a "Keys" en el menú
- Crea 2 API keys:
  - Una para el chatbot admin: `ADMIN_API`
  - Una para el chatbot usuario: `USUARIO_API`
- **Guarda estas keys**, las necesitarás después
- 💡 **Tip**: Puedes usar la misma key para ambos chatbots si quieres

---

## 🗂️ PASO 1: SUBIR LOS CHATBOTS A GITHUB

Los archivos ya están listos en tu proyecto local. Solo necesitas hacer commit y push.

### 1.1 Verificar que los archivos estén correctos

Ejecuta en tu terminal:

```powershell
# Ver archivos del chatbot admin
ls chatbot/

# Deberías ver:
# - streamlit_app.py
# - requirements.txt
# - Dockerfile
# - README.md
# - .streamlit/config.toml

# Ver archivos del chatbot usuario
ls chatbot2/

# Deberías ver:
# - streamlit_app.py
# - requirements.txt
# - Dockerfile
# - .streamlit/config.toml
```

### 1.2 Hacer commit y push

```powershell
git add chatbot/ chatbot2/
git commit -m "Add Streamlit Cloud configuration for chatbots"
git push origin main
```

### 1.3 Verificar en GitHub

Ve a tu fork: https://github.com/javigk01/ElPicantito

Verifica que las carpetas `chatbot/` y `chatbot2/` estén ahí con todos los archivos.

---

## 🌐 PASO 2: DESPLEGAR CHATBOT ADMIN EN STREAMLIT CLOUD

### 2.1 Ir a Streamlit Cloud

1. Ve a: https://share.streamlit.io/
2. Inicia sesión con tu cuenta de GitHub
3. Haz clic en **"New app"** (botón azul grande)

### 2.2 Configurar el despliegue

Llenarás un formulario con estos datos:

| Campo | Valor |
|-------|-------|
| **Repository** | `javigk01/ElPicantito` |
| **Branch** | `main` |
| **Main file path** | `chatbot/streamlit_app.py` |
| **App URL** | `elpicantito-admin` (o el que prefieras) |

**Captura de ejemplo de cómo se ve:**

```
┌─────────────────────────────────────────────┐
│  Deploy an app                              │
├─────────────────────────────────────────────┤
│  Repository: javigk01/ElPicantito          │
│  Branch: main                               │
│  Main file path: chatbot/streamlit_app.py  │
│  App URL: elpicantito-admin                 │
└─────────────────────────────────────────────┘
```

### 2.3 Configurar Variables de Entorno (Secrets)

**ANTES de hacer clic en "Deploy":**

1. Haz clic en **"Advanced settings"** (abajo del formulario)
2. Verás una sección llamada **"Secrets"**
3. Pega este contenido (reemplaza con tus valores reales):

```toml
# Secrets para Chatbot Admin

# API Key de OpenRouter para el chatbot admin
ADMIN_API = "sk-or-v1-tu-api-key-aqui"

# URL del backend (tu URL de ngrok)
SPRINGBOOT_API_BASE = "https://pseudoeconomical-deploringly-kizzy.ngrok-free.dev"
```

**⚠️ IMPORTANTE:** 
- Reemplaza `sk-or-v1-tu-api-key-aqui` con tu API key real de OpenRouter
- Reemplaza la URL de ngrok con la que tienes corriendo actualmente
- **Cada vez que reinicies ngrok**, tendrás que actualizar esta URL en los secrets

### 2.4 Desplegar

1. Haz clic en **"Deploy!"**
2. Espera 2-3 minutos mientras Streamlit Cloud:
   - Clona tu repositorio
   - Instala las dependencias (`requirements.txt`)
   - Inicia la aplicación
3. Verás logs en tiempo real
4. Cuando termine, verás: **"Your app is live!"** 🎉

### 2.5 Obtener la URL pública

Una vez desplegado, verás algo como:

```
https://elpicantito-admin.streamlit.app
```

**✅ GUARDA ESTA URL** - la necesitarás para el frontend

---

## 🌐 PASO 3: DESPLEGAR CHATBOT USUARIO EN STREAMLIT CLOUD

Repite el proceso anterior pero con estos valores:

### 3.1 Crear nueva app

1. En Streamlit Cloud, haz clic en **"New app"** nuevamente
2. Llena el formulario:

| Campo | Valor |
|-------|-------|
| **Repository** | `javigk01/ElPicantito` |
| **Branch** | `main` |
| **Main file path** | `chatbot2/streamlit_app.py` |
| **App URL** | `elpicantito-user` |

### 3.2 Configurar Secrets

En "Advanced settings" → "Secrets", pega:

```toml
# Secrets para Chatbot Usuario

# API Key de OpenRouter para el chatbot usuario
USUARIO_API = "sk-or-v1-tu-api-key-aqui"

# URL del backend (tu URL de ngrok)
SPRINGBOOT_API_BASE = "https://pseudoeconomical-deploringly-kizzy.ngrok-free.dev"
```

### 3.3 Desplegar

1. Haz clic en **"Deploy!"**
2. Espera 2-3 minutos
3. Obtén tu URL pública:

```
https://elpicantito-user.streamlit.app
```

**✅ GUARDA ESTA URL TAMBIÉN**

---

## 🔄 PASO 4: ACTUALIZAR EL FRONTEND EN VERCEL

Ahora que tienes las URLs públicas de los chatbots, necesitas configurarlas en tu frontend.

### 4.1 Buscar las URLs de los chatbots en el código

Los chatbots están configurados en el frontend de Angular. Necesito encontrar dónde:

```powershell
# Buscar referencias a localhost:8501 y localhost:8502
grep -r "8501\|8502" picantito-angular/src/
```

### 4.2 Crear archivo de configuración para las URLs de los chatbots

Voy a crear un archivo de environment para las URLs de los chatbots:

**Archivo: `picantito-angular/src/environments/environment.ts`** (ya existe)

Añadir:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:9998',
  chatbotAdminUrl: 'http://localhost:8501',
  chatbotUserUrl: 'http://localhost:8502'
};
```

**Archivo: `picantito-angular/src/environments/environment.prod.ts`** (ya existe)

Actualizar con tus URLs de Streamlit:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://pseudoeconomical-deploringly-kizzy.ngrok-free.dev',
  chatbotAdminUrl: 'https://elpicantito-admin.streamlit.app',
  chatbotUserUrl: 'https://elpicantito-user.streamlit.app'
};
```

### 4.3 Actualizar los componentes que usan los chatbots

Busca en tu código Angular dónde se abren los chatbots (probablemente con `window.open()` o iframes) y reemplaza las URLs hardcodeadas por:

```typescript
import { environment } from '../../environments/environment';

// En lugar de:
window.open('http://localhost:8501', '_blank');

// Usa:
window.open(environment.chatbotAdminUrl, '_blank');
```

### 4.4 Hacer commit y push

```powershell
git add picantito-angular/src/
git commit -m "Configure Streamlit chatbot URLs for production"
git push origin main
```

### 4.5 Esperar a que Vercel redesplegue

- Ve a tu dashboard de Vercel
- Espera 2-3 minutos
- Verifica que el nuevo deployment esté listo

---

## ✅ PASO 5: PROBAR TODO

### 5.1 Verificar Backend (ngrok)

```
https://pseudoeconomical-deploringly-kizzy.ngrok-free.dev/api/productos
```

Deberías ver JSON con productos.

### 5.2 Verificar Chatbot Admin

```
https://elpicantito-admin.streamlit.app
```

Deberías ver el chatbot con el diseño mexicano.

### 5.3 Verificar Chatbot Usuario

```
https://elpicantito-user.streamlit.app
```

Deberías ver el chatbot con el diseño mexicano.

### 5.4 Verificar Frontend en Vercel

```
https://el-picantito.vercel.app/home
```

- Los productos deben cargar ✅
- El login debe funcionar ✅
- Los botones de chatbot deben abrir las URLs de Streamlit ✅

---

## 🔧 MANTENIMIENTO

### Cuando reinicies ngrok (la URL cambia):

1. **Actualizar Streamlit Cloud:**
   - Ve a https://share.streamlit.io/
   - Haz clic en tu app
   - Ve a "Settings" → "Secrets"
   - Actualiza `SPRINGBOOT_API_BASE` con la nueva URL
   - Haz clic en "Save"
   - La app se reiniciará automáticamente

2. **Actualizar Vercel:**
   - Ejecuta: `.\update-ngrok-url.ps1 "NUEVA_URL"`
   - Haz commit y push
   - Espera a que Vercel redesplegue

### Si quieres actualizar el código de los chatbots:

1. Edita `chatbot/streamlit_app.py` o `chatbot2/streamlit_app.py`
2. Haz commit y push a GitHub
3. Streamlit Cloud detectará el cambio automáticamente
4. La app se actualizará en ~1 minuto

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### Error: "API key invalid"

- Verifica que copiaste la API key completa de OpenRouter
- Asegúrate de que no tiene espacios al principio o al final
- Verifica que el nombre de la variable sea exacto: `ADMIN_API` o `USUARIO_API`

### Error: "Cannot connect to Spring Boot"

- Verifica que ngrok esté corriendo: http://localhost:4040
- Verifica que la URL en los secrets de Streamlit sea correcta
- Prueba la URL manualmente: `https://tu-url.ngrok-free.dev/api/productos`

### El chatbot no se ve en Vercel

- Verifica que las URLs en `environment.prod.ts` sean correctas
- Verifica que el código del frontend use `environment.chatbotAdminUrl`
- Abre la consola del navegador (F12) para ver errores

### La app de Streamlit dice "Sleeping"

- Las apps gratuitas de Streamlit se duermen después de 7 días de inactividad
- Haz clic en "Wake up" para reactivarla
- O simplemente visita la URL, se despertará automáticamente

---

## 📊 RESUMEN DE URLs

Al finalizar, tendrás estas URLs:

| Servicio | URL | Acceso |
|----------|-----|--------|
| **Backend** | `https://pseudoeconomical-deploringly-kizzy.ngrok-free.dev` | Público (cambia al reiniciar) |
| **Chatbot Admin** | `https://elpicantito-admin.streamlit.app` | Público (permanente) |
| **Chatbot Usuario** | `https://elpicantito-user.streamlit.app` | Público (permanente) |
| **Frontend** | `https://el-picantito.vercel.app` | Público (permanente) |

---

## 🎉 ¡LISTO!

Tu aplicación completa está desplegada en la nube:
- ✅ Backend público (desde tu PC con ngrok)
- ✅ Chatbots públicos y permanentes (Streamlit Cloud)
- ✅ Frontend público y permanente (Vercel)

**Todo funciona y es accesible desde cualquier parte del mundo!** 🌍
