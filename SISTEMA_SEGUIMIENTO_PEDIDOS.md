# Sistema de Seguimiento de Pedidos con Notificaciones - El Picantito

## Resumen de Implementación

Se ha implementado un sistema completo de seguimiento de pedidos en tiempo real con las siguientes características:

### ✅ 1. Mapa Integrado en Historial de Pedidos

**Ubicación**: `http://localhost:4200/cliente/{id}/pedidos`

El mapa de seguimiento está ahora integrado directamente en el panel de detalles del pedido seleccionado, eliminando la página independiente de rastreo.

#### Características del Mapa:

- **OpenStreetMap con Leaflet.js**: Mapa interactivo de alta calidad
- **Vistas Dinámicas según Estado**:
  - `RECIBIDO` / `COCINANDO`: Vista centrada en el restaurante
  - `ENVIADO`: Vista de ruta completa con marcadores de origen y destino
  - `ENTREGADO`: Vista centrada en la ubicación del cliente

#### Componentes Modificados:

**Frontend (`pedidos-cliente.component.ts`)**:
- Importa Leaflet y lifecycle hooks (`AfterViewInit`, `OnDestroy`)
- Propiedades del mapa: `map`, `restaurantMarker`, `customerMarker`, `routePolyline`
- Métodos principales:
  - `initializeMap()`: Inicializa OSM con tiles y marcadores
  - `updateMapForStatus(estado)`: Actualiza vista según estado del pedido
  - `drawRoute()`: Dibuja ruta de entrega con polilínea verde

**Template (`pedidos-cliente.component.html`)**:
- Reemplazó placeholder estático con `<div id="trackingMap">`
- Leyenda dinámica con íconos según el estado
- Badge de estado actual junto al título

**Estilos (`pedidos-cliente.component.css`)**:
```css
.tracking-map {
    height: 450px;
    width: 100%;
}

.map-legend {
    display: flex;
    justify-content: center;
    gap: 2rem;
    padding: 1rem;
}
```

---

### ✅ 2. Notificaciones por Email

Se agregó funcionalidad para notificar al cliente cada vez que un operador cambia el estado de su pedido.

#### Servicio de Email (`EmailService.java`)

**Método Principal**:
```java
@Async
public void enviarNotificacionCambioEstado(
    String destinatario, 
    String nombreCliente,
    Long pedidoId, 
    String nuevoEstado
)
```

**Características**:
- ✉️ Emails HTML con diseño profesional
- 🎨 Colores e íconos dinámicos según el estado
- 🔔 Envío asíncrono (no bloquea la respuesta HTTP)
- 📝 Mensajes personalizados por estado:
  - `RECIBIDO`: ✅ "Hemos recibido tu pedido..."
  - `COCINANDO`: 👨‍🍳 "Tu pedido está siendo preparado..."
  - `ENVIADO`: 🚚 "Tu pedido está en camino..."
  - `ENTREGADO`: 🎉 "Tu pedido ha sido entregado..."
  - `CANCELADO`: ❌ "Tu pedido ha sido cancelado..."

**Plantilla de Email**:
- Header con gradiente oscuro y logo "🌮 El Picantito"
- Card colorida con ícono grande según el estado
- Botón CTA para "Ver Seguimiento en Tiempo Real"
- Footer con información legal

---

### ✅ 3. Integración con Controller de Pedidos

Se modificó `PedidoController.java` para enviar automáticamente notificaciones cuando cambia el estado.

**Endpoints Modificados**:

1. **PUT `/api/pedidos/{id}/estado`**
2. **PATCH `/api/pedidos/{id}/estado`**

Ambos endpoints ahora:
```java
// Actualizar estado
Pedido pedido = pedidoService.actualizarEstado(id, estado);

// Enviar notificación automática
if (pedido.getCliente() != null && pedido.getCliente().getCorreo() != null) {
    String nombreCliente = pedido.getCliente().getNombres() + " " + 
                          pedido.getCliente().getApellidos();
    emailService.enviarNotificacionCambioEstado(
        pedido.getCliente().getCorreo(),
        nombreCliente,
        pedido.getId().longValue(),
        pedido.getEstado()
    );
}
```

**Flujo Completo**:
1. Operador cambia estado del pedido desde su panel
2. Backend actualiza estado en BD
3. Se envía email automáticamente al cliente
4. Se retorna respuesta HTTP al operador
5. Cliente recibe email con la actualización

---

### ✅ 4. Actualización en Tiempo Real del Mapa

Implementado sistema de **polling** para sincronizar cambios de estado sin necesidad de recargar la página.

#### Polling Service (`pedidos-cliente.component.ts`)

**Características**:
- ⏱️ Consulta cada 30 segundos
- 🔄 Actualización silenciosa (sin loading spinner)
- 🗺️ Actualiza mapa automáticamente cuando detecta cambio de estado
- 🎯 Mantiene el filtro activo
- 📍 Preserva el pedido seleccionado

**Métodos Implementados**:

```typescript
private startPolling(): void {
  this.pollingInterval = setInterval(() => {
    this.actualizarPedidosSilenciosamente();
  }, 30000); // 30 segundos
}

private actualizarPedidosSilenciosamente(): void {
  this.pedidoManager.getPedidosDelCliente().subscribe({
    next: (data) => {
      // Actualizar lista
      // Detectar cambios de estado
      // Actualizar mapa si el pedido seleccionado cambió
      if (pedidoActualizado.estado !== pedidoSeleccionadoActual.estado) {
        this.updateMapForStatus(pedidoActualizado.estado);
      }
    }
  });
}
```

**Cleanup en `ngOnDestroy()`**:
```typescript
ngOnDestroy() {
  if (this.pollingInterval) {
    clearInterval(this.pollingInterval);
  }
  if (this.map) {
    this.map.remove();
  }
}
```

---

## Flujo Completo del Sistema

### Escenario: Operador cambia estado a "ENVIADO"

1. **Operador** actualiza estado desde panel de pedidos
   ```
   PATCH /api/pedidos/123/estado
   { "estado": "ENVIADO" }
   ```

2. **Backend** (`PedidoController`)
   - Actualiza estado en base de datos
   - Llama a `emailService.enviarNotificacionCambioEstado()`
   - Retorna respuesta HTTP 200

3. **EmailService**
   - Construye email HTML con ícono 🚚 y color azul
   - Envía de forma asíncrona (no bloquea)
   - Cliente recibe email instantáneamente

4. **Frontend** (dentro de 30 segundos)
   - Polling detecta cambio de estado
   - Actualiza badge de estado visual
   - Llama a `updateMapForStatus('ENVIADO')`
   - Mapa dibuja ruta entre restaurante y cliente
   - Vista se ajusta para mostrar ambos puntos

5. **Cliente**
   - Ve el cambio en pantalla
   - Recibe email de notificación
   - Puede hacer clic en "Ver Seguimiento" en el email

---

## Archivos Modificados

### Frontend (Angular)
- ✅ `app.routes.ts` - Eliminada ruta `/rastreo-pedido`
- ✅ `pedidos-cliente.component.ts` - Integrado mapa y polling
- ✅ `pedidos-cliente.component.html` - Mapa OSM en vez de placeholder
- ✅ `pedidos-cliente.component.css` - Estilos para `.tracking-map`

### Backend (Spring Boot)
- ✅ `EmailService.java` - Agregado método `enviarNotificacionCambioEstado()`
- ✅ `PedidoController.java` - Integradas notificaciones en endpoints PUT/PATCH

### Archivos Eliminados
- ❌ `rastreo-pedido/` (directorio completo)
- ❌ `RASTREO_PEDIDOS.md`

---

## Configuración Requerida

### Variables de Entorno (.env)

Para que las notificaciones funcionen, asegúrate de tener configurado el servidor SMTP:

```properties
# application.properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=tu-email@gmail.com
spring.mail.password=tu-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

**Nota**: Para Gmail, necesitas generar una "Contraseña de Aplicación" en lugar de usar tu contraseña normal.

---

## Testing

### Probar el Sistema Completo:

1. **Iniciar Backend y Frontend**
   ```bash
   # Terminal 1 - Backend
   ./mvnw spring-boot:run
   
   # Terminal 2 - Frontend
   cd picantito-angular
   npm start
   ```

2. **Crear un Pedido**
   - Navegar a `http://localhost:4200/tienda`
   - Agregar productos al carrito
   - Completar checkout

3. **Ver Historial con Mapa**
   - Ir a `http://localhost:4200/cliente/{tu-id}/pedidos`
   - Seleccionar el pedido
   - Verificar que el mapa muestre el restaurante centrado

4. **Cambiar Estado desde Panel de Operador**
   - Login como operador
   - Cambiar estado del pedido a "COCINANDO"
   - Verificar que llegue email al cliente

5. **Ver Actualización en Tiempo Real**
   - Mantener abierta la página de historial del cliente
   - Cambiar estado a "ENVIADO" desde operador
   - En 30 segundos o menos, el mapa debe actualizar y mostrar la ruta
   - Verificar recepción del segundo email

---

## Mejoras Futuras Sugeridas

### Corto Plazo:
- [ ] Reducir intervalo de polling a 10-15 segundos para mayor sensación de tiempo real
- [ ] Agregar indicador visual cuando se detecta una actualización
- [ ] Mostrar timestamp de "Última actualización hace X segundos"

### Mediano Plazo:
- [ ] Implementar WebSockets para actualizaciones instantáneas sin polling
- [ ] Agregar notificaciones push del navegador
- [ ] Permitir al cliente recibir SMS además de email

### Largo Plazo:
- [ ] Integración con GPS real del repartidor
- [ ] Usar API de routing (OSRM) para rutas reales por calles
- [ ] Animación del marcador del repartidor moviéndose en el mapa

---

## Dependencias Utilizadas

### Frontend:
```json
{
  "leaflet": "^1.9.x",
  "@types/leaflet": "^1.9.x"
}
```

### Backend:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

---

## Conclusión

El sistema ahora proporciona:
- ✅ Seguimiento visual en tiempo real con mapa interactivo
- ✅ Notificaciones automáticas por email al cliente
- ✅ Sincronización automática cada 30 segundos
- ✅ Experiencia unificada en una sola página
- ✅ Feedback inmediato para operadores y clientes

Todo esto sin necesidad de recargar la página, brindando una experiencia moderna y fluida. 🎉
