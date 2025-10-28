# Página de Ubicaciones - OpenStreetMap

Esta página muestra un mapa interactivo con las sucursales de El Picantito usando OpenStreetMap (Leaflet).

## Cómo personalizar el mapa

### 1. Cambiar las coordenadas del centro del mapa

En el archivo `ubicaciones.ts`, busca la línea:

```typescript
private bogotaCoords = { lat: 4.7110, lng: -74.0721 };
```

Cambia las coordenadas por las que necesites. Puedes obtenerlas de Google Maps o OpenStreetMap.

### 2. Agregar más sucursales

En el método `initMap()`, después del marcador existente, puedes agregar más marcadores:

```typescript
// Ejemplo para agregar una segunda sucursal
const sucursal2 = L.marker([4.6097, -74.0817]).addTo(this.map);
sucursal2.bindPopup('<b>El Picantito</b><br>Sucursal Norte');

// Ejemplo para agregar una tercera sucursal
const sucursal3 = L.marker([4.6533, -74.0836]).addTo(this.map);
sucursal3.bindPopup('<b>El Picantito</b><br>Sucursal Sur');
```

### 3. Cambiar el nivel de zoom

En la línea donde se inicializa el mapa:

```typescript
this.map = L.map('map').setView([this.bogotaCoords.lat, this.bogotaCoords.lng], 13);
```

El número `13` es el nivel de zoom. Puedes cambiarlo:
- Valores más bajos (10-12): vista más alejada (ciudad completa)
- Valores más altos (14-18): vista más cercana (vecindario)

### 4. Agregar información de sucursales

En el archivo `ubicaciones.html`, busca la sección:

```html
<div class="info-card">
  <h3>Información de Contacto</h3>
  <p>Aquí puedes agregar la información de tus sucursales</p>
  <!-- Espacio para agregar información de sucursales -->
</div>
```

Puedes agregar tarjetas con información de cada sucursal:

```html
<div class="info-card">
  <h3>Nuestras Sucursales</h3>
  
  <div class="sucursal">
    <h4>Sucursal Principal</h4>
    <p><strong>Dirección:</strong> Calle 123 #45-67, Bogotá</p>
    <p><strong>Teléfono:</strong> (601) 123-4567</p>
    <p><strong>Horario:</strong> Lun-Dom 11:00 AM - 10:00 PM</p>
  </div>

  <div class="sucursal">
    <h4>Sucursal Norte</h4>
    <p><strong>Dirección:</strong> Carrera 7 #89-12, Bogotá</p>
    <p><strong>Teléfono:</strong> (601) 987-6543</p>
    <p><strong>Horario:</strong> Lun-Dom 12:00 PM - 9:00 PM</p>
  </div>
</div>
```

### 5. Personalizar estilos

Puedes modificar los estilos en el archivo `ubicaciones.css`:
- Cambiar colores
- Ajustar tamaños
- Modificar el diseño responsive

## Recursos útiles

- [Documentación de Leaflet](https://leafletjs.com/)
- [Obtener coordenadas](https://www.latlong.net/)
- [Iconos personalizados](https://leafletjs.com/examples/custom-icons/)
