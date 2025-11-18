import { Component, OnInit, AfterViewInit, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GestionPedidosService } from '../../../services/gestion-pedidos.service';
import { RepartidorService } from '../../../services/repartidor.service';
import { PedidoCompleto } from '../../../models/pedido-completo';
import { Repartidor } from '../../../models/repartidor';
import { OperadorNavbarComponent } from '../../shared/operador-navbar/operador-navbar.component';
import { OperadorSidebarComponent } from '../../shared/operador-sidebar/operador-sidebar.component';
import { obtenerSucursalMasCercana } from '../../../models/sucursal';
import * as L from 'leaflet';

interface PedidosPorEstado {
  [key: string]: PedidoCompleto[];
  recibido: PedidoCompleto[];
  cocinando: PedidoCompleto[];
  enviado: PedidoCompleto[];
  entregado: PedidoCompleto[];
}

@Component({
  selector: 'app-gestion-pedidos',
  imports: [CommonModule, FormsModule, OperadorNavbarComponent, OperadorSidebarComponent],
  templateUrl: './gestion-pedidos.html',
  styleUrl: './gestion-pedidos.css'
})
export class GestionPedidos implements OnInit, AfterViewInit {
  private gestionPedidosService = inject(GestionPedidosService);
  private repartidorService = inject(RepartidorService);
  private elementRef = inject(ElementRef);

  pedidos: PedidoCompleto[] = [];
  pedidosPorEstado: PedidosPorEstado = {
    recibido: [],
    cocinando: [],
    enviado: [],
    entregado: []
  };

  repartidoresDisponibles: Repartidor[] = [];
  todosRepartidores: Repartidor[] = [];
  repartidorSeleccionado: { [pedidoId: number]: number } = {};

  loading = false;
  processingPedidoId: number | null = null; // Para saber qué pedido se está procesando
  error: string | null = null;
  successMessage: string | null = null;

  // Búsqueda
  searchTerm: string = '';
  pedidosOriginales: PedidoCompleto[] = [];

  estadosOrdenados = ['recibido', 'cocinando', 'enviado', 'entregado'];

  estadosLabels: { [key: string]: string } = {
    'recibido': 'Recibido',
    'cocinando': 'Cocinando',
    'enviado': 'Enviado',
    'entregado': 'Entregado'
  };

  // Mapas para pedidos enviados
  private maps: { [pedidoId: number]: L.Map } = {};
  private deliveryMarkers: { [pedidoId: number]: L.Marker } = {};
  private deliveryRoutes: { [pedidoId: number]: L.LatLng[] } = {};
  private deliveryProgress: { [pedidoId: number]: number } = {};
  private deliveryIntervals: { [pedidoId: number]: any } = {};

  ngOnInit(): void {
    this.cargarPedidos();
    this.cargarRepartidores();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.setupScrollAnimations(), 150);
  }

  setupScrollAnimations(): void {
    const elements = this.elementRef.nativeElement.querySelectorAll('.scroll-reveal');

    // Primero remover las clases de animación anteriores
    elements.forEach((element: Element) => {
      const htmlElement = element as HTMLElement;
      htmlElement.classList.remove('animated', 'fadeInUp', 'fadeInDown');
      htmlElement.style.opacity = '0';
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            const animation = element.dataset['animation'] || 'fadeInUp';
            element.style.opacity = '1';
            element.classList.add('animated', animation);
            observer.unobserve(element);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '50px 0px -50px 0px'
      }
    );

    elements.forEach((element: Element, index: number) => {
      const htmlElement = element as HTMLElement;
      const rect = htmlElement.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

      if (isVisible) {
        setTimeout(() => {
          const animation = htmlElement.dataset['animation'] || 'fadeInUp';
          htmlElement.style.opacity = '1';
          htmlElement.classList.add('animated', animation);
        }, index * 100);
      } else {
        observer.observe(element);
      }
    });
  }

  cargarPedidos(): void {
    this.loading = true;
    this.error = null;

    this.gestionPedidosService.getAllPedidos().subscribe({
      next: (pedidos) => {
        this.pedidos = pedidos;
        this.pedidosOriginales = [...pedidos]; // Guardar copia original
        this.organizarPedidosPorEstado();
        this.loading = false;
        // Aplicar animaciones después de cargar
        setTimeout(() => this.setupScrollAnimations(), 200);
      },
      error: (err) => {
        this.error = 'Error al cargar los pedidos';
        console.error('Error:', err);
        this.loading = false;
      }
    });
  }

  cargarRepartidores(): void {
    // Cargar todos los repartidores para mostrarlos con su estado
    this.repartidorService.getRepartidores().subscribe({
      next: (repartidores) => {
        this.todosRepartidores = repartidores;
        // También mantener la lista de solo disponibles para validaciones
        this.repartidoresDisponibles = repartidores.filter(r => r.estado === 'DISPONIBLE');
      },
      error: (err) => {
        console.error('Error al cargar repartidores:', err);
      }
    });
  }

  cargarRepartidoresDisponibles(): void {
    this.repartidorService.getRepartidoresDisponibles().subscribe({
      next: (repartidores) => {
        this.repartidoresDisponibles = repartidores;
      },
      error: (err) => {
        console.error('Error al cargar repartidores:', err);
      }
    });
  }

  organizarPedidosPorEstado(): void {
    this.pedidosPorEstado = {
      recibido: this.pedidos.filter(p => p.estado.toLowerCase() === 'recibido'),
      cocinando: this.pedidos.filter(p => p.estado.toLowerCase() === 'cocinando'),
      enviado: this.pedidos.filter(p => p.estado.toLowerCase() === 'enviado'),
      entregado: this.pedidos.filter(p => p.estado.toLowerCase() === 'entregado')
    };
  }

  avanzarEstado(pedido: PedidoCompleto): void {
    const estadoActual = pedido.estado.toLowerCase();
    const indiceActual = this.estadosOrdenados.indexOf(estadoActual);

    if (indiceActual === -1 || indiceActual >= this.estadosOrdenados.length - 1) {
      this.error = 'No se puede avanzar más el estado del pedido';
      return;
    }

    const nuevoEstado = this.estadosOrdenados[indiceActual + 1];

    // Si el nuevo estado es "enviado", verificar que tenga repartidor asignado
    if (nuevoEstado === 'enviado') {
      const repartidorId = this.repartidorSeleccionado[pedido.id];
      if (!repartidorId) {
        this.error = 'Debe seleccionar un repartidor antes de enviar el pedido';
        return;
      }

      // Primero asignar el repartidor
      this.asignarRepartidor(pedido.id, repartidorId, nuevoEstado);
    } else {
      // Para otros estados, solo actualizar el estado
      this.actualizarEstadoPedido(pedido.id, nuevoEstado);
    }
  }

  asignarRepartidor(pedidoId: number, repartidorId: number, nuevoEstado: string): void {
    this.processingPedidoId = pedidoId;
    this.error = null;

    this.gestionPedidosService.asignarRepartidor({ pedidoId, repartidorId }).subscribe({
      next: () => {
        // Después de asignar, actualizar el estado
        this.actualizarEstadoPedido(pedidoId, nuevoEstado);
      },
      error: (err) => {
        this.error = err.error || 'Error al asignar repartidor';
        console.error('Error:', err);
        this.processingPedidoId = null;

        // Limpiar mensaje de error después de 5 segundos
        setTimeout(() => {
          this.error = null;
        }, 5000);
      }
    });
  }

  actualizarEstadoPedido(pedidoId: number, nuevoEstado: string): void {
    this.processingPedidoId = pedidoId;
    this.error = null;

    // Agregar clase de animación de salida al pedido que se va a mover
    const pedidoElement = document.querySelector(`[data-pedido-id="${pedidoId}"]`);
    if (pedidoElement) {
      pedidoElement.classList.add('animated', 'fadeOutRight', 'faster');
    }

    this.gestionPedidosService.actualizarEstado(pedidoId, nuevoEstado).subscribe({
      next: (pedidoActualizado) => {
        this.successMessage = `Pedido #${pedidoId} actualizado a ${this.estadosLabels[nuevoEstado]}`;

        // Esperar a que termine la animación de salida
        setTimeout(() => {
          // Actualizar el pedido en la lista local
          const index = this.pedidos.findIndex(p => p.id === pedidoId);
          if (index !== -1) {
            this.pedidos[index] = pedidoActualizado;
          }

          this.organizarPedidosPorEstado();

          // Recargar lista de repartidores para actualizar disponibilidad
          this.cargarRepartidores();

          this.processingPedidoId = null;

          // Animar solo el nuevo elemento en su nueva columna
          setTimeout(() => {
            const nuevoElement = document.querySelector(`[data-pedido-id="${pedidoId}"]`);
            if (nuevoElement) {
              nuevoElement.classList.add('animated', 'fadeInLeft', 'faster');
              // Asegurar que la animación se vea aplicando la opacidad
              (nuevoElement as HTMLElement).style.opacity = '1';
            }
          }, 50);
        }, 400);

        // Limpiar mensaje después de 3 segundos
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);

        // Si llegó a "enviado", recargar repartidores disponibles
        if (nuevoEstado === 'enviado') {
          this.cargarRepartidoresDisponibles();
        }
      },
      error: (err) => {
        this.error = 'Error al actualizar el estado del pedido';
        console.error('Error:', err);
        this.processingPedidoId = null;

        // Remover animación de salida si hubo error
        if (pedidoElement) {
          pedidoElement.classList.remove('animated', 'fadeOutRight', 'faster');
        }
      }
    });
  }

  puedeAvanzar(estado: string): boolean {
    const indice = this.estadosOrdenados.indexOf(estado.toLowerCase());
    return indice !== -1 && indice < this.estadosOrdenados.length - 1;
  }

  getColorEstadoRepartidor(estado: string | undefined): string {
    if (!estado) return 'bg-secondary';

    switch (estado.toUpperCase()) {
      case 'DISPONIBLE':
        return 'bg-success';
      case 'OCUPADO':
        return 'bg-warning';
      case 'INACTIVO':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor);
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getColorEstado(estado: string): string {
    const colores: { [key: string]: string } = {
      'recibido': 'bg-info',
      'cocinando': 'bg-warning',
      'enviado': 'bg-primary',
      'entregado': 'bg-success'
    };
    return colores[estado.toLowerCase()] || 'bg-secondary';
  }

  getDireccionSinCoordenadas(direccion: string): string {
    if (!direccion) return '';
    // Si la dirección contiene el formato "Dirección|lat,lng", extraer solo la dirección
    const partes = direccion.split('|');
    return partes[0] || direccion;
  }

  // ==================== BÚSQUEDA ====================

  buscarPedidos(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      // Si no hay término de búsqueda, mostrar todos los pedidos
      this.pedidos = [...this.pedidosOriginales];
      this.organizarPedidosPorEstado();
      // Re-aplicar animaciones después de mostrar todos los pedidos
      setTimeout(() => this.setupScrollAnimations(), 100);
      return;
    }

    const termino = this.searchTerm.toLowerCase().trim();

    // Filtrar pedidos por ID o nombre de cliente
    this.pedidos = this.pedidosOriginales.filter(pedido => {
      // Buscar por ID del pedido
      const matchId = pedido.id?.toString().includes(termino);

      // Buscar por nombre del cliente
      const matchCliente = pedido.clienteNombre?.toLowerCase().includes(termino);

      return matchId || matchCliente;
    });

    this.organizarPedidosPorEstado();
    // Re-aplicar animaciones después de filtrar
    setTimeout(() => this.setupScrollAnimations(), 100);
  }

  limpiarBusqueda(): void {
    this.searchTerm = '';
    this.buscarPedidos();
  }

  // ==================== MAPAS PARA PEDIDOS ENVIADOS ====================

  initMapForPedido(pedidoId: number, direccion: string): void {
    // Esperar un momento para que el DOM esté listo
    setTimeout(() => {
      const mapContainer = document.getElementById(`map-${pedidoId}`);
      if (!mapContainer) return;

      // Evitar reinicializar si ya existe
      if (this.maps[pedidoId]) return;

      // Extraer coordenadas del cliente
      const partes = direccion.split('|');
      if (partes.length < 2) return;

      const coords = partes[1].split(',');
      const customerLat = parseFloat(coords[0]);
      const customerLng = parseFloat(coords[1]);

      if (isNaN(customerLat) || isNaN(customerLng)) return;

      // Obtener sucursal más cercana
      const sucursal = obtenerSucursalMasCercana(customerLat, customerLng);

      // Crear mapa centrado en la sucursal
      const map = L.map(`map-${pedidoId}`).setView([sucursal.lat, sucursal.lng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      this.maps[pedidoId] = map;

      // Crear marcadores
      const restaurantIcon = L.icon({
        iconUrl: 'assets/leaflet/marker-icon.png',
        iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
        shadowUrl: 'assets/leaflet/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      const restaurantMarker = L.marker([sucursal.lat, sucursal.lng], { icon: restaurantIcon })
        .addTo(map)
        .bindPopup(`<div style="color: #d32f2f; font-weight: bold;">🏪 ${sucursal.nombre}</div>`);

      const customerMarker = L.marker([customerLat, customerLng], { icon: restaurantIcon })
        .addTo(map)
        .bindPopup(`<div style="color: #1976d2; font-weight: bold;">📍 Cliente</div>`);

      // Dibujar ruta con OSRM
      this.drawRouteForPedido(pedidoId, sucursal.lat, sucursal.lng, customerLat, customerLng, map);
    }, 300);
  }

  private async drawRouteForPedido(pedidoId: number, restaurantLat: number, restaurantLng: number, customerLat: number, customerLng: number, map: L.Map): Promise<void> {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${restaurantLng},${restaurantLat};${customerLng},${customerLat}?overview=full&geometries=geojson`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const coordinates = route.geometry.coordinates;

        const latLngs: L.LatLngExpression[] = coordinates.map((coord: number[]) => [coord[1], coord[0]]);

        // Guardar ruta para tracking simulado
        this.deliveryRoutes[pedidoId] = latLngs.map(coord => {
          if (Array.isArray(coord)) {
            return L.latLng(coord[0], coord[1]);
          }
          return coord as L.LatLng;
        });

        // Dibujar la ruta
        L.polyline(latLngs, {
          color: '#28a745',
          weight: 5,
          opacity: 0.7
        }).addTo(map);

        // Ajustar vista para mostrar toda la ruta
        const bounds = L.latLngBounds(latLngs as L.LatLngExpression[]);
        map.fitBounds(bounds, { padding: [50, 50] });

        // Iniciar tracking simulado del repartidor
        this.startSimulatedTracking(pedidoId, map);
      }
    } catch (error) {
      console.error('Error al dibujar ruta:', error);
    }
  }

  private startSimulatedTracking(pedidoId: number, map: L.Map): void {
    const route = this.deliveryRoutes[pedidoId];
    if (!route || route.length === 0) return;

    this.deliveryProgress[pedidoId] = 0;

    // Crear marcador del repartidor
    const deliveryIcon = L.icon({
      iconUrl: 'assets/leaflet/marker-icon.png',
      iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
      shadowUrl: 'assets/leaflet/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    const startPosition = route[0];
    this.deliveryMarkers[pedidoId] = L.marker(startPosition, { icon: deliveryIcon })
      .addTo(map)
      .bindPopup('<div style="color: #ff6600; font-weight: bold;">🚚 Repartidor</div>');

    // Simular movimiento cada 2 segundos
    this.deliveryIntervals[pedidoId] = setInterval(() => {
      this.deliveryProgress[pedidoId] += 0.02; // Avanzar 2% cada iteración

      if (this.deliveryProgress[pedidoId] >= 1) {
        this.deliveryProgress[pedidoId] = 0; // Reiniciar al llegar al final
      }

      const index = Math.floor(this.deliveryProgress[pedidoId] * (route.length - 1));
      const newPosition = route[index];
      
      if (this.deliveryMarkers[pedidoId]) {
        this.deliveryMarkers[pedidoId].setLatLng(newPosition);
      }
    }, 2000);
  }

  stopTrackingForPedido(pedidoId: number): void {
    // Detener intervalo
    if (this.deliveryIntervals[pedidoId]) {
      clearInterval(this.deliveryIntervals[pedidoId]);
      delete this.deliveryIntervals[pedidoId];
    }

    // Limpiar marcador
    if (this.deliveryMarkers[pedidoId] && this.maps[pedidoId]) {
      this.maps[pedidoId].removeLayer(this.deliveryMarkers[pedidoId]);
      delete this.deliveryMarkers[pedidoId];
    }

    // Limpiar mapa
    if (this.maps[pedidoId]) {
      this.maps[pedidoId].remove();
      delete this.maps[pedidoId];
    }

    // Limpiar datos
    delete this.deliveryRoutes[pedidoId];
    delete this.deliveryProgress[pedidoId];
  }
}
