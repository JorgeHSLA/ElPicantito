# Chatbot de El Picantito 🌮🤖

Chatbot inteligente con integración a Spring Boot para brindar información en tiempo real sobre el sistema.

## 🚀 Características

### Modo Básico (Sin conexión a Spring Boot)
- Responde preguntas generales sobre la funcionalidad del sitio
- Tono amigable con humor mexicano
- Interfaz temática mexicana

### Modo Avanzado (Con conexión a Spring Boot)
El chatbot puede acceder y proporcionar información en tiempo real sobre:

✅ **Estadísticas del Sistema**
- Total de pedidos realizados
- Ingresos totales y netos
- Productos más y menos vendidos
- Adicionales más y menos consumidos

✅ **Gestión de Usuarios**
- Total de usuarios registrados
- Distribución por roles (ADMIN, CLIENTE, OPERADOR, REPARTIDOR)
- Estado de usuarios

✅ **Catálogo de Productos**
- Lista de productos disponibles
- Precios y descripciones
- Estado de disponibilidad

✅ **Adicionales**
- Lista de adicionales disponibles
- Precios de adicionales
- Combinaciones permitidas con productos

✅ **Personalización**
- Relaciones producto-adicional configuradas
- Opciones de personalización disponibles

## 📋 Requisitos

- Python 3.8+
- API Key de DeepSeek/OpenRouter
- (Opcional) API de Spring Boot ejecutándose

## 🔧 Configuración

### 1. Instalar dependencias

```bash
cd chatbot
pip install -r requirements.txt
```

### 2. Configurar variables de entorno

Crear archivo `.env` basado en `.env.example`:

```bash
# Requerido
DEEPSEEK_API_KEY=tu_api_key_de_openrouter

# Opcional (por defecto: http://localhost:9998)
SPRINGBOOT_API_BASE=http://localhost:9998
```

### 3. Ejecutar el chatbot

```bash
streamlit run streamlit_app.py
```

## 🐳 Docker

### Construcción de la imagen

```bash
docker build -t chatbot-picantito .
```

### Ejecutar el contenedor

```bash
docker run -p 8501:8501 \
  -e DEEPSEEK_API_KEY=tu_api_key \
  -e SPRINGBOOT_API_BASE=http://host.docker.internal:9998 \
  chatbot-picantito
```

**Nota:** Usa `host.docker.internal` en lugar de `localhost` para acceder a Spring Boot desde el contenedor.

## 🌐 Endpoints Utilizados

El chatbot consulta los siguientes endpoints de Spring Boot:

| Endpoint | Descripción |
|----------|-------------|
| `GET /api/estadisticas/todas` | Todas las estadísticas del sistema |
| `GET /api/usuarios/dto` | Lista de usuarios (sin contraseñas) |
| `GET /api/productos` | Catálogo de productos |
| `GET /api/adicional` | Lista de adicionales |
| `GET /api/adicional/productoAdicionales` | Relaciones producto-adicional |
| `GET /actuator/health` | Estado de salud del sistema |

## 🔒 Seguridad

- **Contraseñas protegidas:** El endpoint `/api/usuarios/dto` NO incluye contraseñas
- **CORS configurado:** Los endpoints están configurados para aceptar solicitudes del chatbot
- **Cache inteligente:** Los datos se cachean por 5 minutos para reducir carga en el servidor
- **Timeout:** Las solicitudes tienen timeout de 5 segundos para evitar bloqueos

## 💡 Ejemplos de Preguntas

Con conexión a Spring Boot, puedes preguntar:

- "¿Cuántos pedidos tenemos en total?"
- "¿Cuáles son los productos más vendidos?"
- "¿Cuántos usuarios registrados hay?"
- "¿Qué adicionales están disponibles?"
- "¿Cuántos ingresos hemos generado?"
- "¿Qué productos están disponibles actualmente?"
- "¿Cuántos usuarios son administradores?"

## 🛠️ Troubleshooting

### El chatbot no se conecta a Spring Boot

1. Verifica que Spring Boot esté ejecutándose: `http://localhost:9998/actuator/health`
2. Revisa la variable `SPRINGBOOT_API_BASE`
3. Si usas Docker, asegúrate de usar `host.docker.internal` en lugar de `localhost`
4. Verifica que CORS esté configurado correctamente en Spring Boot

### El chatbot funciona pero no obtiene datos

1. Revisa los logs del chatbot para ver errores de conexión
2. Verifica que los endpoints estén accesibles sin autenticación (GET públicos)
3. Comprueba que el formato de respuesta JSON sea correcto

### Cache desactualizado

El cache se actualiza automáticamente cada 5 minutos. Para forzar actualización:
1. Detén Streamlit
2. Borra el cache: `streamlit cache clear`
3. Reinicia Streamlit

## 📊 Monitoreo

El chatbot muestra el estado de conexión en la interfaz:

- ✅ Verde: Conectado correctamente a Spring Boot
- ⚠️ Amarillo: Conexión con problemas
- ❌ Rojo: Sin conexión (modo básico)

## 🔄 Actualizaciones Futuras

- [ ] Soporte para más endpoints (pedidos, repartidores)
- [ ] Gráficos interactivos de estadísticas
- [ ] Notificaciones en tiempo real
- [ ] Integración con WebSocket para datos en vivo
- [ ] Comandos administrativos desde el chat

## 📄 Licencia

Este proyecto es parte de El Picantito. Todos los derechos reservados.
