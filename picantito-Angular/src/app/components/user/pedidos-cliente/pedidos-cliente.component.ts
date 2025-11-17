import { Component, inject, OnInit, AfterViewInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PedidoRestService, PedidoDto } from '../../../services/tienda/pedido-rest.service';
import { PedidoManagerService } from '../../../services/tienda/pedido-manager.service';
import { AuthService } from '../../../services/auth.service';
import { PedidoCompleto } from '../../../models/pedido-completo';
import { obtenerSucursalMasCercana, Sucursal } from '../../../models/sucursal';
import * as L from 'leaflet';

@Component({
  selector: 'app-pedidos-cliente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedidos-cliente.component.html',
  styleUrls: ['./pedidos-cliente.component.css']
})
export class PedidosClienteComponent implements OnInit, AfterViewInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pedidoService = inject(PedidoRestService);
  private pedidoManager = inject(PedidoManagerService);
  private authService = inject(AuthService);

  pedidos = signal<PedidoCompleto[]>([]);
  pedidosFiltrados = signal<PedidoCompleto[]>([]);
  filtroActivo = signal<string>('TODOS');
  loading = signal<boolean>(true);
  error = signal<string>('');
  
  // Pedido seleccionado para vista detallada
  pedidoSeleccionado = signal<PedidoCompleto | null>(null);

  // Mapa de seguimiento
  private map: L.Map | null = null;
  private restaurantMarker: L.Marker | null = null;
  private customerMarker: L.Marker | null = null;
  private routePolyline: L.Polyline | null = null;
  private pollingInterval: any = null;

  // Coordenadas (se actualizarán dinámicamente)
  restaurantLocation: { lat: number; lng: number; name: string } | null = null;
  customerLocation = { lat: 4.6097, lng: -74.0817, name: 'Tu ubicación' };

  // Signal para mostrar mensaje de éxito
  showSuccessMessage = signal(false);
  newPedidoId = signal<number | null>(null);

  ngOnInit(): void {
    // Verificar autenticación
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Verificar si viene de crear un pedido
    this.route.queryParams.subscribe(params => {
      if (params['pedidoCreado']) {
        this.newPedidoId.set(+params['pedidoCreado']);
        this.showSuccessMessage.set(true);
        // El usuario cierra el modal manualmente, no automáticamente
        
        // Limpiar query params
        this.router.navigate([], {
          queryParams: {},
          replaceUrl: true
        });
      }
    });

    // Obtener usuario actual en lugar de usar parámetro de ruta
    const usuario = this.authService.loggedUser();
    if (!usuario || !usuario.id) {
      this.error.set('Usuario no válido');
      this.loading.set(false);
      return;
    }

    // Cargar pedidos del cliente usando el nuevo servicio
    this.pedidoManager.getPedidosDelCliente().subscribe({
      next: (data) => {
        // Ordenar pedidos por ID descendente (más recientes primero)
        const pedidosOrdenados = [...(data || [])].sort((a, b) => (b.id || 0) - (a.id || 0));
        this.pedidos.set(pedidosOrdenados);
        this.pedidosFiltrados.set(pedidosOrdenados);
        this.loading.set(false);
        
        // Si viene de crear pedido, seleccionar ese pedido
        const pedidoCreado = this.newPedidoId();
        if (pedidoCreado) {
          const pedido = pedidosOrdenados.find(p => p.id === pedidoCreado);
          if (pedido) {
            this.pedidoSeleccionado.set(pedido);
          } else if (pedidosOrdenados.length > 0) {
            this.pedidoSeleccionado.set(pedidosOrdenados[0]);
          }
        } else if (pedidosOrdenados.length > 0) {
          // Seleccionar el primer pedido automáticamente
          this.pedidoSeleccionado.set(pedidosOrdenados[0]);
        }
        
        // Iniciar polling para actualizar estados cada 30 segundos
        this.startPolling();
      },
      error: (err) => {
        console.error('Error cargando pedidos:', err);
        this.error.set('No se pudieron cargar los pedidos');
        this.loading.set(false);
      }
    });
  }

  // ==================== POLLING PARA ACTUALIZACIONES EN TIEMPO REAL ====================

  private startPolling(): void {
    // Actualizar pedidos cada 30 segundos
    this.pollingInterval = setInterval(() => {
      this.actualizarPedidosSilenciosamente();
    }, 30000); // 30 segundos
  }

  private actualizarPedidosSilenciosamente(): void {
    // Actualizar sin mostrar loading
    this.pedidoManager.getPedidosDelCliente().subscribe({
      next: (data) => {
        const pedidosOrdenados = [...(data || [])].sort((a, b) => (b.id || 0) - (a.id || 0));
        const pedidoSeleccionadoActual = this.pedidoSeleccionado();
        
        // Actualizar lista de pedidos
        this.pedidos.set(pedidosOrdenados);
        
        // Reaplicar filtro si hay uno activo
        if (this.filtroActivo() !== 'TODOS') {
          const filtrados = pedidosOrdenados.filter(p => 
            p.estado.toUpperCase() === this.filtroActivo().toUpperCase()
          );
          this.pedidosFiltrados.set(filtrados);
        } else {
          this.pedidosFiltrados.set(pedidosOrdenados);
        }
        
        // Actualizar pedido seleccionado si cambió su estado
        if (pedidoSeleccionadoActual) {
          const pedidoActualizado = pedidosOrdenados.find(p => p.id === pedidoSeleccionadoActual.id);
          if (pedidoActualizado && pedidoActualizado.estado !== pedidoSeleccionadoActual.estado) {
            this.pedidoSeleccionado.set(pedidoActualizado);
            // Actualizar mapa con el nuevo estado
            this.updateMapForStatus(pedidoActualizado.estado);
          }
        }
      },
      error: (err) => {
        console.error('Error en polling de pedidos:', err);
      }
    });
  }

  // ==================== MÉTODOS DE FILTRADO ====================

  filtrarPorEstado(estado: string): void {
    this.filtroActivo.set(estado);
    
    if (estado === 'TODOS') {
      this.pedidosFiltrados.set(this.pedidos());
    } else {
      const filtrados = this.pedidos().filter(p => 
        p.estado.toUpperCase() === estado.toUpperCase()
      );
      this.pedidosFiltrados.set(filtrados);
    }
    
    // Si hay pedidos filtrados y ninguno seleccionado, seleccionar el primero
    if (this.pedidosFiltrados().length > 0 && !this.pedidoSeleccionado()) {
      this.seleccionarPedido(this.pedidosFiltrados()[0]);
    }
  }

  seleccionarPedido(pedido: PedidoCompleto): void {
    this.pedidoSeleccionado.set(pedido);
    // Actualizar ubicación del cliente basado en la dirección del pedido
    this.actualizarUbicacionCliente(pedido.direccion);
  }

  private async actualizarUbicacionCliente(direccion: string): Promise<void> {
    try {
      console.log('🔍 ===== ACTUALIZAR UBICACIÓN CLIENTE =====');
      console.log('📥 Dirección recibida:', direccion);
      console.log('📥 Tipo de dirección:', typeof direccion);
      console.log('📥 Longitud:', direccion?.length);
      console.log('🔍 Contiene "|":', direccion.includes('|'));
      
      // Verificar si la dirección contiene coordenadas en formato "Dirección|lat,lng"
      let lat: number, lng: number;
      let direccionLimpia = direccion;
      
      if (direccion && direccion.includes('|')) {
        console.log('✅ Detectado formato con coordenadas');
        const partes = direccion.split('|');
        console.log('📦 Partes separadas:', partes);
        
        direccionLimpia = partes[0];
        const coordsString = partes[1];
        console.log('📍 String de coordenadas:', coordsString);
        
        const coords = coordsString.split(',');
        console.log('🎯 Coordenadas separadas:', coords);
        
        lat = parseFloat(coords[0]);
        lng = parseFloat(coords[1]);
        
        console.log('🔢 Coordenadas parseadas:', { lat, lng });
        console.log('✅ ¿Son números válidos?', !isNaN(lat) && !isNaN(lng));
        
        // VERIFICAR que las coordenadas sean válidas
        if (!isNaN(lat) && !isNaN(lng)) {
          // Actualizar ubicación del cliente directamente
          this.customerLocation = {
            lat: lat,
            lng: lng,
            name: direccionLimpia
          };
          
          console.log('✅✅✅ UBICACIÓN ACTUALIZADA CORRECTAMENTE:');
          console.log('   📍 Dirección:', direccionLimpia);
          console.log('   📍 Coordenadas:', { lat, lng });
          console.log('   📍 customerLocation:', this.customerLocation);
        } else {
          console.error('❌ Coordenadas inválidas después del parsing');
          throw new Error('Coordenadas inválidas');
        }
        
      } else {
        console.log('⚠️ NO detectado pipe "|", buscando con Nominatim...');
        // Fallback: usar Nominatim API para geocoding si no hay coordenadas
        console.log('⚠️ Dirección sin coordenadas, usando Nominatim...');
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccionLimpia + ', Bogotá, Colombia')}&limit=1`;
        console.log('📡 URL Nominatim:', url);
        
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'ElPicantito/1.0'
          }
        });
        const data = await response.json();
        console.log('📦 Respuesta Nominatim:', data);

        if (data && data.length > 0) {
          lat = parseFloat(data[0].lat);
          lng = parseFloat(data[0].lon);
          const displayName = data[0].display_name;
        
          // Actualizar ubicación del cliente
          this.customerLocation = {
            lat: lat,
            lng: lng,
            name: direccionLimpia
          };

          console.log(`✅ Dirección geocodificada exitosamente:`);
          console.log(`   📍 Dirección buscada: ${direccionLimpia}`);
          console.log(`   📍 Resultado: ${displayName}`);
          console.log(`   📍 Coordenadas: (${lat}, ${lng})`);
        } else {
          console.warn('⚠️ No se pudo geocodificar la dirección:', direccionLimpia);
          // Usar ubicación por defecto si falla
          this.customerLocation = { lat: 4.6097, lng: -74.0817, name: direccionLimpia };
        }
      }

      // Reinicializar el mapa con la nueva ubicación
      setTimeout(() => {
        console.log('🗺️ Reinicializando mapa con ubicación:', this.customerLocation);
        this.initializeMap();
        const pedido = this.pedidoSeleccionado();
        if (pedido) {
          this.updateMapForStatus(pedido.estado);
        }
      }, 100);

    } catch (error) {
      console.error('❌ Error en geocoding:', error);
      // Usar ubicación por defecto
      this.customerLocation = { lat: 4.6097, lng: -74.0817, name: direccion };
      
      setTimeout(() => {
        this.initializeMap();
        const pedido = this.pedidoSeleccionado();
        if (pedido) {
          this.updateMapForStatus(pedido.estado);
        }
      }, 100);
    }
  }

  ngAfterViewInit() {
    // Inicializar mapa después de que la vista esté lista
    setTimeout(() => {
      this.initializeMap();
    }, 300);
  }

  ngOnDestroy() {
    // Detener polling
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    
    // Limpiar el mapa al destruir el componente
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  // ==================== MÉTODOS DEL MAPA ====================

  private initializeMap() {
    const mapContainer = document.getElementById('trackingMap');
    if (!mapContainer) return;

    // Determinar sucursal más cercana al cliente
    const sucursalMasCercana = obtenerSucursalMasCercana(this.customerLocation.lat, this.customerLocation.lng);
    this.restaurantLocation = {
      lat: sucursalMasCercana.lat,
      lng: sucursalMasCercana.lng,
      name: sucursalMasCercana.nombre
    };

    // Limpiar mapa anterior si existe
    if (this.map) {
      this.map.remove();
    }

    // Crear mapa
    this.map = L.map('trackingMap').setView([this.restaurantLocation.lat, this.restaurantLocation.lng], 13);

    // Agregar tiles de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);

    console.log('🗺️ Mapa inicializado');
    console.log('   🏪 Restaurante:', this.restaurantLocation);
    console.log('   👤 Cliente:', this.customerLocation);

    // Actualizar mapa según estado inicial (esto creará los marcadores necesarios)
    const pedido = this.pedidoSeleccionado();
    if (pedido) {
      this.updateMapForStatus(pedido.estado);
    }
  }

  private updateMapForStatus(estado: string) {
    if (!this.map || !this.restaurantLocation) return;

    // Limpiar elementos del mapa
    if (this.routePolyline) {
      this.map.removeLayer(this.routePolyline);
      this.routePolyline = null;
    }
    if (this.restaurantMarker) {
      this.map.removeLayer(this.restaurantMarker);
      this.restaurantMarker = null;
    }
    if (this.customerMarker) {
      this.map.removeLayer(this.customerMarker);
      this.customerMarker = null;
    }

    const estadoUpper = estado.toUpperCase();
    console.log('🔄 Actualizando mapa para estado:', estadoUpper);

    switch (estadoUpper) {
      case 'RECIBIDO':
        console.log('📥 RECIBIDO: Solo mostrar sucursal');
        // Solo mostrar marcador de sucursal
        this.createRestaurantMarker();
        this.map.setView([this.restaurantLocation.lat, this.restaurantLocation.lng], 15);
        break;

      case 'COCINANDO':
        console.log('👨‍🍳 COCINANDO: Solo mostrar sucursal');
        // Solo mostrar marcador de sucursal
        this.createRestaurantMarker();
        this.map.setView([this.restaurantLocation.lat, this.restaurantLocation.lng], 15);
        break;

      case 'ENVIADO':
        console.log('🚚 ENVIADO: Mostrar sucursal, cliente y ruta');
        // Mostrar sucursal, cliente y ruta
        this.createRestaurantMarker();
        this.createCustomerMarker();
        this.drawRouteWithOSRM();
        break;

      case 'ENTREGADO':
        console.log('✅ ENTREGADO: Solo mostrar cliente');
        // Solo mostrar marcador del cliente
        this.createCustomerMarker();
        this.map.setView([this.customerLocation.lat, this.customerLocation.lng], 15);
        break;

      default:
        console.log('❓ Estado desconocido - Vista por defecto');
        this.createRestaurantMarker();
        this.createCustomerMarker();
        this.map.setView([this.restaurantLocation.lat, this.restaurantLocation.lng], 13);
        break;
    }
  }

  private createRestaurantMarker() {
    if (!this.map || !this.restaurantLocation) return;

    const restaurantIcon = L.icon({
      iconUrl: 'assets/leaflet/marker-icon.png',
      iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
      shadowUrl: 'assets/leaflet/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    this.restaurantMarker = L.marker(
      [this.restaurantLocation.lat, this.restaurantLocation.lng],
      { icon: restaurantIcon }
    ).addTo(this.map);
    
    this.restaurantMarker.bindPopup(
      `<div style="color: #d32f2f; font-weight: bold;">🏪 ${this.restaurantLocation.name}</div>`,
      { closeButton: false }
    );
  }

  private createCustomerMarker() {
    if (!this.map) return;

    const customerIcon = L.icon({
      iconUrl: 'assets/leaflet/marker-icon.png',
      iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
      shadowUrl: 'assets/leaflet/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    this.customerMarker = L.marker(
      [this.customerLocation.lat, this.customerLocation.lng],
      { icon: customerIcon }
    ).addTo(this.map);
    
    this.customerMarker.bindPopup(
      `<div style="color: #1976d2; font-weight: bold;">📍 ${this.customerLocation.name}</div>`,
      { closeButton: false }
    );
  }

  private async drawRouteWithOSRM() {
    if (!this.map || !this.restaurantLocation) return;

    try {
      // Construir URL para OSRM API (servicio público de routing)
      const url = `https://router.project-osrm.org/route/v1/driving/${this.restaurantLocation.lng},${this.restaurantLocation.lat};${this.customerLocation.lng},${this.customerLocation.lat}?overview=full&geometries=geojson`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const coordinates = route.geometry.coordinates;

        // Convertir coordenadas de [lng, lat] a [lat, lng] para Leaflet
        const latLngs: L.LatLngExpression[] = coordinates.map((coord: number[]) => [coord[1], coord[0]]);

        // Dibujar la ruta
        this.routePolyline = L.polyline(latLngs, {
          color: '#28a745',
          weight: 5,
          opacity: 0.8,
          lineJoin: 'round'
        }).addTo(this.map);

        const distanciaKm = (route.distance / 1000).toFixed(1);
        const tiempoMin = Math.round(route.duration / 60);
        
        this.routePolyline.bindPopup(`🚚 Ruta de entrega<br>📏 ${distanciaKm} km<br>⏱️ ~${tiempoMin} min`);

        // Ajustar vista para mostrar toda la ruta
        const bounds = L.latLngBounds(latLngs);
        this.map!.fitBounds(bounds, { padding: [50, 50] });
      } else {
        // Fallback a línea directa si OSRM falla
        this.drawRouteFallback();
      }
    } catch (error) {
      console.error('Error obteniendo ruta de OSRM:', error);
      // Fallback a línea directa
      this.drawRouteFallback();
    }
  }

  private drawRouteFallback() {
    if (!this.map || !this.restaurantLocation) return;

    const routeCoordinates: L.LatLngExpression[] = [
      [this.restaurantLocation.lat, this.restaurantLocation.lng],
      [this.customerLocation.lat, this.customerLocation.lng]
    ];

    this.routePolyline = L.polyline(routeCoordinates, {
      color: '#28a745',
      weight: 4,
      opacity: 0.7,
      dashArray: '10, 10'
    }).addTo(this.map);

    this.routePolyline.bindPopup('🚚 Ruta de entrega (estimada)');

    // Ajustar vista
    const bounds = L.latLngBounds(routeCoordinates);
    this.map.fitBounds(bounds, { padding: [50, 50] });
  }

  formatearAdicionales(adicionales: any[]): string {
    if (!adicionales || adicionales.length === 0) {
      return '';
    }
    return adicionales.map(a => a.nombreAdicional).join(', ');
  }

  contarPorEstado(estado: string): number {
    if (estado === 'TODOS') {
      return this.pedidos().length;
    }
    return this.pedidos().filter(p => 
      p.estado.toUpperCase() === estado.toUpperCase()
    ).length;
  }

  // ==================== MÉTODOS DE UTILIDAD ====================

  formatearFecha(fecha: string): string {
    return this.pedidoManager.formatearFecha(fecha);
  }

  formatearMoneda(valor: number): string {
    return this.pedidoManager.formatearMoneda(valor);
  }

  // ==================== MÉTODOS DE ACCIÓN ====================

  eliminarPedido(pedidoId: number): void {
    const confirmar = confirm('¿Estás seguro de que quieres eliminar este pedido? Esta acción no se puede deshacer.');
    if (!confirmar) return;

    this.loading.set(true);
    
    // Eliminar el pedido completamente
    this.pedidoService.eliminarPedido(pedidoId).subscribe({
      next: () => {
        // Eliminar el pedido de la lista local
        const pedidosActuales = this.pedidos().filter(p => p.id !== pedidoId);
        this.pedidos.set(pedidosActuales);
        
        // Actualizar los pedidos filtrados también
        const pedidosFiltradosActuales = this.pedidosFiltrados().filter(p => p.id !== pedidoId);
        this.pedidosFiltrados.set(pedidosFiltradosActuales);
        
        this.loading.set(false);
        alert('Pedido eliminado exitosamente');
      },
      error: (error) => {
        console.error('Error al eliminar pedido:', error);
        this.loading.set(false);
        const mensaje = error.error?.message || 'No se pudo eliminar el pedido. Intenta nuevamente.';
        alert(mensaje);
      }
    });
  }

  // ==================== MÉTODOS DE UTILIDAD DE VISTA ====================

  getEstadoClass(estado: string): string {
    switch (estado.toUpperCase()) {
      case 'RECIBIDO': return 'badge bg-info';
      case 'COCINANDO': return 'badge bg-warning text-dark';
      case 'ENVIADO': return 'badge bg-primary';
      case 'ENTREGADO': return 'badge bg-success';
      case 'CANCELADO': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }

  puedeSerEliminado(pedido: PedidoCompleto): boolean {
    const estado = pedido.estado.toUpperCase();
    // Solo se pueden eliminar pedidos que están RECIBIDOS
    return estado === 'RECIBIDO';
  }

  calcularSubtotalProducto(producto: any): number {
    if (!producto.precioProducto) return 0;
    
    let subtotal = producto.precioProducto * producto.cantidadProducto;
    
    // Agregar precio de adicionales
    if (producto.adicionales && producto.adicionales.length > 0) {
      for (const adicional of producto.adicionales) {
        if (adicional.precioAdicional) {
          subtotal += adicional.precioAdicional * adicional.cantidadAdicional;
        }
      }
    }
    
    return subtotal;
  }
}
