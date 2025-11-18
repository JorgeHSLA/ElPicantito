# 🤖 Sistema de Chatbots Duales - El Picantito

## 📋 Descripción General

El proyecto ahora cuenta con **dos chatbots independientes** integrados con el sistema:

1. **Chatbot Administrativo** (`chatbot/`) - Para administradores
2. **Asistente Virtual de Usuario** (`chatbot2/`) - Para clientes finales

Ambos chatbots utilizan **OpenRouter API** con modelos de IA (Google Gemini 2.0 Flash) pero con claves API separadas y contextos de información diferentes.

---

## 🏗️ Arquitectura del Sistema

### Estructura de Servicios

```
┌─────────────────────────────────────────────────────────┐
│                    Angular Frontend                     │
│  ┌──────────────────────┐  ┌──────────────────────────┐│
│  │  Admin Dashboard     │  │   Tienda (User View)     ││
│  │  ┌──────────────┐    │  │   ┌──────────────────┐   ││
│  │  │ Admin Sidebar│    │  │   │ Floating Button  │   ││
│  │  │ Chatbot Btn  │───┐│  │   │  (Bottom Right)  │──┐││
│  │  └──────────────┘   ││  │   └──────────────────┘  │││
│  └──────────────────────┘│  └─────────────────────────┘│
└───────────│──────────────┴─────────────│────────────────┘
            │                            │
            │ iframe                     │ iframe
            │ http://chatbot:8501        │ http://chatbot2:8502
            ▼                            ▼
┌────────────────────────┐  ┌────────────────────────────┐
│  Chatbot Admin (8501)  │  │  Chatbot User (8502)       │
│  ┌──────────────────┐  │  │  ┌──────────────────────┐  │
│  │ ADMIN_API        │  │  │  │ USUARIO_API          │  │
│  │ Full Access      │  │  │  │ Limited Access       │  │
│  │ - Stats          │  │  │  │ - Products only      │  │
│  │ - Users          │  │  │  │ - Prices             │  │
│  │ - All Products   │  │  │  │ - Navigation help    │  │
│  │ - All Adicionales│  │  │  │ - No admin data      │  │
│  └──────────────────┘  │  │  └──────────────────────┘  │
└────────────│───────────┘  └────────────│───────────────┘
             │                           │
             └───────────┬───────────────┘
                         ▼
              ┌──────────────────────┐
              │  Spring Boot API     │
              │  (Port 9998)         │
              │  ┌────────────────┐  │
              │  │ /api/productos │  │
              │  │ /api/adicional │  │
              │  │ /api/estadísticas│ (Admin only)
              │  │ /api/usuarios  │  │ (Admin only)
              │  └────────────────┘  │
              └──────────│───────────┘
                         ▼
              ┌──────────────────────┐
              │  PostgreSQL DB       │
              │  (Port 5432)         │
              └──────────────────────┘
```

---

## 🔑 Claves API y Variables de Entorno

### Archivo `.env`

```env
# API Keys de OpenRouter (separadas para cada chatbot)
ADMIN_API=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
USUARIO_API=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

# Spring Boot API Base URL (para comunicación interna)
SPRINGBOOT_API_BASE=http://springboot:9998

# Database Configuration
DB_URL=jdbc:postgresql://db:5432/picantitodb
DB_USERNAME=taquito
DB_PASSWORD=taquito123

# JWT Configuration
JWT_SECRET=TacosPicantitosSuperSecretKeyForJWT2024MustBeAtLeast256BitsLong!
JWT_EXPIRATION=86400000

# Mail Configuration
MAIL_USERNAME=elpicantitotacosautenticos@gmail.com
MAIL_PASSWORD=ailkspvblmlheaya
```

### ¿Por qué claves API separadas?

1. **Aislamiento de límites de tokens**: Cada chatbot tiene su propio límite diario
2. **Tracking independiente**: Monitorear uso de admin vs usuarios finales
3. **Seguridad**: Si una clave se compromete, solo afecta a un chatbot
4. **Escalabilidad**: Permite upgrades independientes a planes pagos

---

## 📁 Estructura de Archivos

```
ElPicantito/
├── chatbot/                          # Chatbot Administrativo
│   ├── streamlit_app.py             # App con contexto admin completo
│   ├── requirements.txt
│   ├── Dockerfile                   # Puerto 8501
│   └── .streamlit/
│       └── config.toml
│
├── chatbot2/                         # Chatbot de Usuario
│   ├── streamlit_app.py             # App con contexto limitado
│   ├── requirements.txt
│   ├── Dockerfile                   # Puerto 8502
│   └── .streamlit/
│       └── config.toml
│
├── picantito-Angular/
│   └── src/app/components/
│       ├── shared/
│       │   └── admin-sidebar/
│       │       ├── admin-sidebar.ts  # Botón + modal chatbot admin
│       │       ├── admin-sidebar.html
│       │       └── admin-sidebar.css
│       └── user/
│           └── tienda/
│               ├── tienda.ts         # Botón flotante + modal usuario
│               ├── tienda.html
│               └── tienda.css        # Estilos del botón flotante
│
├── docker-compose.yml               # Orquestación de servicios
├── .env                             # Variables de entorno
└── CHATBOT_SETUP.md                 # Este archivo
```

---

## 🚀 Configuración de Docker Compose

### Servicios en `docker-compose.yml`

```yaml
services:
  # Chatbot Administrativo
  chatbot:
    build:
      context: chatbot/
      dockerfile: Dockerfile
    container_name: elpicantito-chat-admin
    # SIN puertos expuestos - solo acceso interno
    env_file:
      - .env
    depends_on:
      - springboot

  # Chatbot de Usuario
  chatbot2:
    build:
      context: chatbot2/
      dockerfile: Dockerfile
    container_name: elpicantito-chat-user
    # SIN puertos expuestos - solo acceso interno
    env_file:
      - .env
    depends_on:
      - springboot

  # Spring Boot API
  springboot:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: elpicantito-spring
    ports:
      - "9998:9998"
    env_file:
      - .env
    depends_on:
      - db

  # PostgreSQL Database
  db:
    image: postgres:16.1
    container_name: ElPicantitoDB
    restart: always
    volumes:
      - ./sql/schema_completo.sql:/docker-entrypoint-initdb.d/1_create_schema.sql:ro
      - ./sql/datos_picantito.sql:/docker-entrypoint-initdb.d/2_datos_picantito.sql:ro
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: 'picantitodb'
      POSTGRES_USER: 'taquito'
      POSTGRES_PASSWORD: 'taquito123'
    ports:
      - '5432:5432'

volumes:
  postgres_data:
```

### ⚠️ Importante: Puertos NO Expuestos

Los chatbots **NO tienen puertos expuestos** al host. Solo son accesibles desde:
- Angular frontend (vía iframe)
- Red interna de Docker (`picantito-network`)

Esto es intencional por seguridad - los chatbots solo deben ser accesibles a través de la aplicación Angular.

---

## 🎨 Integración Frontend (Angular)

### 1. Admin Sidebar (Chatbot Administrativo)

**Ubicación**: `admin-sidebar.ts`

```typescript
// Botón en la barra lateral
<li class="nav-item">
  <button class="nav-link btn-chatbot" (click)="toggleChatbot()">
    <i class="bi bi-chat-dots me-2"></i>Chatbot Admin
  </button>
</li>

// Modal con iframe
<div class="chatbot-modal" *ngIf="showChatbot" (click)="toggleChatbot()">
  <div class="chatbot-container" (click)="$event.stopPropagation()">
    <div class="chatbot-header">
      <h5><i class="bi bi-robot me-2"></i>Chatbot Administrativo</h5>
      <button class="btn-close-chatbot" (click)="toggleChatbot()">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>
    <iframe 
      src="http://chatbot:8501" 
      class="chatbot-iframe"
      frameborder="0">
    </iframe>
  </div>
</div>
```

**Características**:
- Modal centralizado que ocupa 80% de la pantalla
- Acceso a estadísticas completas del sistema
- Información de usuarios
- Todos los productos y adicionales
- Cierre con botón X o clic fuera del modal

---

### 2. Tienda Component (Asistente Virtual de Usuario)

**Ubicación**: `tienda.ts` y `tienda.html`

```typescript
// Botón flotante (bottom-right)
<button class="floating-chatbot-button" 
        (click)="toggleChatbot()" 
        [class.active]="showChatbot">
  <i class="bi bi-chat-dots-fill"></i>
</button>

// Modal con iframe
<div class="chatbot-modal" *ngIf="showChatbot" (click)="toggleChatbot()">
  <div class="chatbot-container" (click)="$event.stopPropagation()">
    <div class="chatbot-header">
      <h5><i class="bi bi-robot me-2"></i>Asistente Virtual</h5>
      <button class="btn-close-chatbot" (click)="toggleChatbot()">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>
    <iframe 
      src="http://chatbot2:8502" 
      class="chatbot-iframe"
      frameborder="0">
    </iframe>
  </div>
</div>
```

**Estilos CSS** (en `tienda.css`):

```css
/* Botón flotante en esquina inferior derecha */
.floating-chatbot-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b6b, #ff9e00);
  border: none;
  color: white;
  font-size: 28px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
  z-index: 1000;
}

.floating-chatbot-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.6);
}
```

**Características**:
- Botón flotante visible en todo momento
- Acceso a productos y precios
- Ayuda de navegación (ubicación de carrito, perfil, etc.)
- **SIN acceso a estadísticas ni usuarios**

---

## 🔐 Diferencias de Contexto

### Chatbot Admin (`chatbot/streamlit_app.py`)

**Endpoints Accesibles**:
- ✅ `/api/estadisticas/todas` - Estadísticas completas
- ✅ `/api/usuarios/dto` - Lista de usuarios
- ✅ `/api/productos` - Todos los productos
- ✅ `/api/adicional` - Todos los adicionales
- ✅ `/api/adicional/productoAdicionales` - Relaciones

**Contexto del Sistema**:
```python
contexto_base = """Eres un asistente útil para la página web 'El Picantito', 
un restaurante mexicano. Responde amablemente a las preguntas sobre las 
funcionalidades del sitio. Usa un tono cálido y amigable."""

# Información adicional incluida:
- Total de pedidos
- Ingresos totales y netos
- Productos más vendidos (con nombres)
- Total de usuarios por rol
- Catálogo completo de productos
- Todas las combinaciones producto-adicional
```

**Ejemplo de Respuestas Admin**:
- "Tenemos 47 usuarios registrados, 3 admins, 2 operadores y 42 clientes"
- "Los ingresos netos son $12,450 este mes"
- "El producto más vendido es Tacos al Pastor con 89 pedidos"

---

### Chatbot Usuario (`chatbot2/streamlit_app.py`)

**Endpoints Accesibles**:
- ✅ `/api/productos` - Solo productos públicos
- ✅ `/api/adicional` - Solo adicionales disponibles
- ❌ `/api/estadisticas` - **NO ACCESIBLE**
- ❌ `/api/usuarios` - **NO ACCESIBLE**

**Contexto del Usuario**:
```python
contexto_base = """Eres un asistente útil para clientes de 'El Picantito', 
un restaurante mexicano. Ayuda a los usuarios a conocer nuestro menú, 
precios, y navegar por la página web.

IMPORTANTE: Solo puedes responder preguntas sobre:
- Los productos del menú y sus precios
- Los adicionales disponibles y sus precios
- Cómo navegar por la página web
- Recomendaciones de platillos

NAVEGACIÓN DE LA PÁGINA:
- Botón "Crear Taco" está en la parte inferior de la lista de productos
- Perfil y órdenes están en el icono de persona en la esquina superior derecha
- Carrito de compras está en la parte superior de la pantalla

NO tienes acceso a estadísticas, información de usuarios, ni funciones 
administrativas."""

# Información adicional incluida:
- Lista de productos con nombres, precios y descripciones
- Adicionales disponibles agrupados por tipo
- Instrucciones de navegación
```

**Ejemplo de Respuestas Usuario**:
- "Tenemos Tacos al Pastor por $3.50, Tacos de Carnitas por $3.25..."
- "Puedes personalizar tu taco con cilantro (+$0.25), cebolla (+$0.25)..."
- "El botón 'Crear Taco' está en la parte inferior de la lista de productos"
- Si preguntan por estadísticas: "No tengo acceso a esa información. Contacta con el personal del restaurante."

---

## 🛠️ Comandos de Ejecución

### 1. Construcción y Ejecución Completa

```powershell
# Desde el directorio raíz ElPicantito/
docker compose build --no-cache
docker compose up
```

### 2. Ejecutar Solo Chatbots (para pruebas)

```powershell
# Solo chatbot admin
docker compose up chatbot

# Solo chatbot usuario
docker compose up chatbot2

# Ambos chatbots
docker compose up chatbot chatbot2
```

### 3. Verificar Logs

```powershell
# Logs del chatbot admin
docker logs elpicantito-chat-admin --follow

# Logs del chatbot usuario
docker logs elpicantito-chat-user --follow

# Logs de todos los servicios
docker compose logs --follow
```

### 4. Reconstruir Servicios Individuales

```powershell
# Reconstruir chatbot admin
docker compose build --no-cache chatbot
docker compose up -d chatbot

# Reconstruir chatbot usuario
docker compose build --no-cache chatbot2
docker compose up -d chatbot2
```

---

## 🔍 Verificación del Sistema

### Checklist de Funcionamiento

1. **Base de Datos**:
   ```powershell
   docker exec -it ElPicantitoDB psql -U taquito -d picantitodb -c "SELECT COUNT(*) FROM productos;"
   ```
   ✅ Debe devolver el conteo de productos

2. **Spring Boot**:
   - Navegar a: `http://localhost:9998/actuator/health`
   - ✅ Debe mostrar: `{"status":"UP"}`

3. **Chatbot Admin** (desde dentro de Docker):
   ```powershell
   docker exec -it elpicantito-chat-admin curl http://localhost:8501
   ```
   ✅ Debe devolver HTML de Streamlit

4. **Chatbot Usuario** (desde dentro de Docker):
   ```powershell
   docker exec -it elpicantito-chat-user curl http://localhost:8502
   ```
   ✅ Debe devolver HTML de Streamlit

5. **Frontend Angular**:
   - **Admin**: Login → Dashboard → Sidebar → Clic en "Chatbot Admin"
   - **Usuario**: Tienda → Botón flotante (esquina inferior derecha)

---

## 🐛 Troubleshooting

### Problema: Iframe muestra página en blanco

**Causa**: Los contenedores de chatbot no están corriendo o hay error de CORS.

**Solución**:
```powershell
# Verificar estado de contenedores
docker ps -a | Select-String "chat"

# Ver logs de errores
docker logs elpicantito-chat-admin --tail 50
docker logs elpicantito-chat-user --tail 50

# Reconstruir desde cero
docker compose down
docker compose build --no-cache chatbot chatbot2
docker compose up chatbot chatbot2
```

---

### Problema: "API key faltante" en Streamlit

**Causa**: Variables de entorno no se cargaron correctamente.

**Solución**:
1. Verificar que `.env` existe en la raíz del proyecto
2. Verificar que contiene `ADMIN_API` y `USUARIO_API`
3. Reconstruir contenedores:
   ```powershell
   docker compose down
   docker compose up --build
   ```

---

### Problema: "No se puede conectar a Spring Boot"

**Causa**: Spring Boot no terminó de iniciar o hay error de red.

**Solución**:
```powershell
# Verificar que Spring Boot esté corriendo
docker logs elpicantito-spring --tail 100 | Select-String "Started"

# Debe mostrar: "Started PicantitoApplication in X seconds"

# Si no está listo, esperar 30 segundos y recargar la página
```

---

### Problema: "429 Too Many Requests" (Rate Limit)

**Causa**: Se excedió el límite de tokens de OpenRouter (free tier).

**Solución**:
1. **Esperar 24 horas** - Los límites se resetean a medianoche UTC
2. Verificar uso en: https://openrouter.ai/activity
3. Si es crítico, upgrade a plan pago en OpenRouter
4. Cambiar a otro modelo con más límite en `streamlit_app.py`:
   ```python
   model="meta-llama/llama-3.2-3b-instruct:free"  # Alternativa
   ```

---

## 📊 Monitoreo y Métricas

### Verificar Uso de API (OpenRouter)

1. Login en: https://openrouter.ai
2. Ir a: **Activity** > **Usage**
3. Filtrar por:
   - **ADMIN_API** (sk-or-v1-76255...)
   - **USUARIO_API** (sk-or-v1-78f13...)

**Límites Free Tier** (por clave):
- Google Gemini 2.0 Flash: ~200 requests/día
- Reset: Medianoche UTC (1 AM hora de España, 7 PM hora de México)

---

### Logs Importantes

**Chatbot Admin** (`docker logs elpicantito-chat-admin`):
- ✅ `Streamlit server is running on port 8501`
- ✅ `✅ Conectado a Spring Boot`
- ❌ `❌ Error al llamar a la API: 429` (Rate limit)

**Chatbot Usuario** (`docker logs elpicantito-chat-user`):
- ✅ `Streamlit server is running on port 8502`
- ✅ `✅ Sistema listo`
- ❌ `🔑 API key faltante` (Falta USUARIO_API en .env)

---

## 🔄 Flujo de Actualización

### Para modificar contexto del chatbot

1. **Editar archivo Python**:
   ```powershell
   # Admin
   notepad chatbot/streamlit_app.py

   # Usuario
   notepad chatbot2/streamlit_app.py
   ```

2. **Reconstruir solo ese servicio**:
   ```powershell
   docker compose build --no-cache chatbot   # o chatbot2
   docker compose up -d chatbot              # o chatbot2
   ```

3. **Verificar cambios**:
   - Refrescar página en Angular (Ctrl+F5)
   - Abrir el chatbot y probar

---

### Para modificar integración Angular

1. **Editar componente**:
   ```powershell
   # Admin sidebar
   notepad picantito-Angular/src/app/components/shared/admin-sidebar/admin-sidebar.ts

   # Tienda (usuario)
   notepad picantito-Angular/src/app/components/user/tienda/tienda.ts
   ```

2. **Compilar Angular** (si no está en modo watch):
   ```powershell
   cd picantito-Angular
   ng build --configuration production
   ```

3. **Refrescar navegador**: Ctrl+F5

---

## 📚 Recursos Adicionales

### Documentación Oficial

- **Streamlit**: https://docs.streamlit.io/
- **OpenRouter**: https://openrouter.ai/docs
- **Docker Compose**: https://docs.docker.com/compose/
- **Angular**: https://angular.io/docs

### Modelos AI Disponibles en OpenRouter

**Free Tier Recomendados**:
1. `google/gemini-2.0-flash-exp:free` ✅ **Actualmente usado**
   - Rápido, buen contexto, 200 req/día
2. `meta-llama/llama-3.2-3b-instruct:free`
   - Más límite de requests pero menos inteligente
3. `deepseek/deepseek-r1:free`
   - Muy inteligente pero límite bajo (30 req/día)

**Cambiar modelo** en `streamlit_app.py`:
```python
stream = client.chat.completions.create(
    model="google/gemini-2.0-flash-exp:free",  # Cambiar aquí
    messages=st.session_state.messages,
    stream=True,
)
```

---

## 🎯 Mejoras Futuras Sugeridas

1. **Autenticación JWT en Chatbot Admin**:
   - Validar token JWT antes de mostrar datos sensibles
   - Implementar en `chatbot/streamlit_app.py`

2. **Rate Limiting Local**:
   - Limitar requests por usuario/sesión
   - Prevenir abuso del chatbot público

3. **Caché de Respuestas**:
   - Cachear respuestas comunes del chatbot usuario
   - Reducir llamadas a OpenRouter API

4. **Historial de Conversaciones**:
   - Guardar conversaciones en base de datos
   - Analytics de preguntas frecuentes

5. **Modo Offline del Chatbot Usuario**:
   - Respuestas automáticas para preguntas básicas
   - Fallback si OpenRouter está caído

---

## 📝 Notas de Seguridad

### ⚠️ IMPORTANTE

1. **Nunca exponer puertos de chatbot al host**:
   - Los chatbots solo deben ser accesibles vía iframe desde Angular
   - NO agregar `ports:` en docker-compose para chatbot/chatbot2

2. **Proteger claves API**:
   - `.env` debe estar en `.gitignore`
   - Usar variables de entorno en producción
   - Rotar claves periódicamente

3. **Validar entrada de usuario**:
   - Sanitizar inputs antes de enviar a AI
   - Implementar límite de caracteres

4. **CORS Configuration**:
   - Solo permitir iframe desde dominio del frontend
   - Configurado en `.streamlit/config.toml`:
     ```toml
     [server]
     enableCORS = true
     enableXsrfProtection = false  # Solo para desarrollo
     ```

---

## ✅ Checklist de Implementación

- [x] Crear `chatbot2/` con estructura completa
- [x] Configurar `ADMIN_API` y `USUARIO_API` en `.env`
- [x] Modificar `chatbot/streamlit_app.py` para usar `ADMIN_API`
- [x] Crear `chatbot2/streamlit_app.py` con contexto limitado
- [x] Actualizar `docker-compose.yml` con servicio `chatbot2`
- [x] Remover puertos expuestos de chatbots
- [x] Agregar botón de chatbot en `admin-sidebar.ts`
- [x] Agregar botón flotante en `tienda.ts`
- [x] Implementar modal de iframe en ambos componentes
- [x] Añadir estilos CSS para botones y modales
- [ ] **Probar sistema completo** con `docker compose up`
- [ ] Verificar acceso a chatbot admin desde dashboard
- [ ] Verificar acceso a chatbot usuario desde tienda
- [ ] Confirmar que chatbots no son accesibles directamente (sin frontend)
- [ ] Validar que contextos son diferentes (admin ve stats, usuario NO)

---

## 🤝 Soporte

Si encuentras problemas:

1. **Revisa los logs**: `docker compose logs --follow`
2. **Verifica .env**: Asegúrate que las claves API estén correctas
3. **Chequea la red Docker**: `docker network inspect elpicantito_default`
4. **Valida Spring Boot**: `http://localhost:9998/actuator/health`

---

## 📜 Licencia

Este sistema de chatbots duales es parte del proyecto **El Picantito** © 2024

---

**Última actualización**: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
**Versión del documento**: 1.0.0
