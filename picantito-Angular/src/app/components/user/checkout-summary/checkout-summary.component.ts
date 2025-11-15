import { Component, effect, signal, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../../services/carrito.service';
import { PedidoManagerService } from '../../../services/tienda/pedido-manager.service';
import { AuthService } from '../../../services/auth.service';
import { CartItem, CartSummary } from '../../../models/cart-item';
import * as L from 'leaflet';

@Component({
  selector: 'app-checkout-summary',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './checkout-summary.html',
  styleUrl: './checkout-summary.css'
})
export class CheckoutSummaryComponent implements AfterViewInit, OnDestroy {
  cartItems = signal<CartItem[]>([]);
  cartSummary = signal<CartSummary | null>(null);
  subtotal = signal(0);
  total = signal(0);
  isProcessingOrder = signal(false);

  // Formulario de datos adicionales
  customerInfo = {
    direccion: '',
    direccionTemporal: '', // Para editar en el modal
    telefono: '',
    correo: '',
    observaciones: ''
  };

  erroresValidacion: string[] = [];

  // Mapa y ubicación
  showMapModal = signal(false);
  private map: L.Map | null = null;
  private marker: L.Marker | null = null;
  private geocodingTimeout: any = null;
  selectedCoordinates: { lat: number, lng: number } | null = null;
  isLoadingLocation = signal(false);
  locationErrorMessage = signal<string>('');
  
  // Coordenadas por defecto (Bogotá, Colombia - Centro)
  private defaultCoords = { lat: 4.6097, lng: -74.0817 };
  
  // Límites de Bogotá (aproximados)
  private bogotaBounds = {
    north: 4.8347,  // Norte de Bogotá
    south: 4.4711,  // Sur de Bogotá
    east: -73.9937, // Este de Bogotá
    west: -74.2239  // Oeste de Bogotá
  };

  // Estados de edición
  isEditingTelefono = signal(false);
  isEditingCorreo = signal(false);
  telefonoOriginal = '';
  correoOriginal = '';

  // Modal de confirmación de pedido
  showOrderConfirmationModal = signal(false);
  orderConfirmationData = signal<{ pedidoId: number, total: number } | null>(null);

  constructor(
    private carritoService: CarritoService,
    private pedidoManager: PedidoManagerService,
    private authService: AuthService,
    private router: Router
  ) {
    // Verificar autenticación
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Cargar datos del usuario
    this.loadUserData();

    // Effect para manejar items del carrito (solo sistema nuevo)
    effect(() => {
      const items = this.carritoService.cartItems();
      const summary = this.carritoService.getCartSummary();
      
      this.cartItems.set(items);
      this.cartSummary.set(summary);

      if (summary) {
        this.subtotal.set(summary.total);
        this.total.set(summary.total);
      } else {
        this.subtotal.set(0);
        this.total.set(0);
      }

      // Si no hay items, redirigir a tienda
      if (items.length === 0) {
        this.router.navigate(['/tienda']);
      }
    });
  }

  confirmarPedido() {
    console.log('🚀 INICIANDO CONFIRMACIÓN DE PEDIDO...');
    
    this.erroresValidacion = [];
    
    // Validar dirección
    if (!this.customerInfo.direccion.trim()) {
      this.erroresValidacion.push('📍 Debes seleccionar una dirección de entrega usando el mapa');
    }

    // Validar teléfono
    if (!this.customerInfo.telefono.trim()) {
      this.erroresValidacion.push('📱 El teléfono de contacto es obligatorio');
    } else if (this.customerInfo.telefono.length < 7) {
      this.erroresValidacion.push('📱 El teléfono debe tener al menos 7 dígitos');
    }

    // Validar correo
    if (!this.customerInfo.correo.trim()) {
      this.erroresValidacion.push('📧 El correo electrónico es obligatorio');
    } else if (!this.isValidEmail(this.customerInfo.correo)) {
      this.erroresValidacion.push('📧 El correo electrónico no es válido');
    }

    // Validar usuario autenticado
    const usuario = this.authService.loggedUser();
    console.log('👤 Usuario logueado:', usuario);
    console.log('🔍 Detalles del ID:', {
      id: usuario?.id,
      tipo: typeof usuario?.id,
      esNumero: typeof usuario?.id === 'number',
      valor: usuario?.id
    });
    
    if (!usuario || !usuario.id) {
      this.erroresValidacion.push('No se pudo identificar el usuario. Por favor, inicia sesión nuevamente.');
      return;
    }

    // Validar que el ID sea un número válido (convertir si es string)
    const clienteId = Number(usuario.id);
    console.log('🔢 Cliente ID procesado:', {
      original: usuario.id,
      convertido: clienteId,
      esValido: !isNaN(clienteId) && clienteId > 0 && clienteId <= 2147483647
    });
    
    if (isNaN(clienteId) || clienteId <= 0 || clienteId > 2147483647) {
      console.error('❌ ID de usuario inválido:', usuario.id, 'Tipo:', typeof usuario.id);
      this.erroresValidacion.push('ID de usuario inválido. Por favor, cierra sesión e inicia sesión nuevamente.');
      return;
    }

    // Validar pedido
    const summary = this.cartSummary();
    console.log('📋 Resumen del carrito:', summary);
    
    if (summary) {
      const validacion = this.pedidoManager.validarPedido(summary);
      console.log('✅ Validación del pedido:', validacion);
      
      if (!validacion.valido) {
        this.erroresValidacion.push(...validacion.errores);
      }
    } else {
      this.erroresValidacion.push('El carrito está vacío');
    }

    if (this.erroresValidacion.length > 0) {
      console.log('❌ Errores de validación:', this.erroresValidacion);
      return;
    }

    console.log('🔄 Procesando pedido...');
    this.isProcessingOrder.set(true);

    // Usar siempre el nuevo sistema (sin fecha de entrega)
    this.pedidoManager.procesarPedidoDesdeCarrito(
      this.customerInfo.direccion.trim()
    ).subscribe({
      next: (pedidoCreado) => {
        console.log('✅ Pedido creado exitosamente:', pedidoCreado);
        
        // Limpiar carrito después del pedido exitoso
        this.carritoService.limpiarCarritoCompleto();
        
        // Mostrar modal de confirmación personalizado
        this.orderConfirmationData.set({
          pedidoId: pedidoCreado.id,
          total: summary!.total
        });
        this.showOrderConfirmationModal.set(true);
        
        // Navegar después de 3 segundos
        setTimeout(() => {
          this.closeOrderConfirmationModal();
          this.router.navigate(['/pedidos']);
        }, 3000);
      },
      error: (error) => {
        console.error('❌ Error al procesar pedido:', error);
        this.erroresValidacion.push('Error al procesar el pedido. Intenta nuevamente.');
        this.isProcessingOrder.set(false);
      }
    });
  }

  // Actualizar cantidad de un producto
  actualizarCantidad(itemId: string, cantidad: number) {
    console.log('🔄 Actualizando cantidad:', itemId, cantidad);
    this.carritoService.actualizarCantidadCartItem(itemId, cantidad);
  }

  // Alias para compatibilidad con HTML existente
  updateNewCartQuantity(itemId: string, cantidad: number) {
    this.actualizarCantidad(itemId, cantidad);
  }

  // Eliminar item del carrito
  eliminarItem(itemId: string) {
    console.log('🗑️ Eliminando item:', itemId);
    this.carritoService.removerCartItem(itemId);
  }

  // Alias para compatibilidad con HTML existente
  removeNewCartItem(itemId: string) {
    this.eliminarItem(itemId);
  }

  // ==================== MÉTODOS AUXILIARES ====================

  // ==================== MÉTODOS DE NAVEGACIÓN ====================

  // Volver al carrito (cerrar esta página)
  goBackToCart() {
    this.router.navigate(['/tienda']);
  }

  // Continuar comprando
  continueShopping() {
    this.router.navigate(['/tienda']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToTienda() {
    this.router.navigate(['/tienda']);
  }

  // ==================== MÉTODOS DE CARGA DE DATOS ====================

  loadUserData() {
    const usuario = this.authService.loggedUser();
    if (usuario) {
      // Cargar teléfono y correo del usuario
      this.customerInfo.telefono = usuario.telefono || '';
      this.customerInfo.correo = usuario.correo || '';
      // Guardar valores originales
      this.telefonoOriginal = this.customerInfo.telefono;
      this.correoOriginal = this.customerInfo.correo;
    }
  }

  // ==================== MÉTODOS DE EDICIÓN DE CAMPOS ====================

  toggleEditTelefono() {
    this.isEditingTelefono.set(!this.isEditingTelefono());
    if (!this.isEditingTelefono()) {
      // Si se cancela, restaurar valor original
      this.customerInfo.telefono = this.telefonoOriginal;
    }
  }

  saveEditTelefono() {
    if (this.customerInfo.telefono.trim()) {
      this.telefonoOriginal = this.customerInfo.telefono;
      this.isEditingTelefono.set(false);
    }
  }

  toggleEditCorreo() {
    this.isEditingCorreo.set(!this.isEditingCorreo());
    if (!this.isEditingCorreo()) {
      // Si se cancela, restaurar valor original
      this.customerInfo.correo = this.correoOriginal;
    }
  }

  saveEditCorreo() {
    if (this.customerInfo.correo.trim() && this.isValidEmail(this.customerInfo.correo)) {
      this.correoOriginal = this.customerInfo.correo;
      this.isEditingCorreo.set(false);
    }
  }

  private isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  // ==================== MODAL DE CONFIRMACIÓN ====================

  closeOrderConfirmationModal() {
    this.showOrderConfirmationModal.set(false);
    this.orderConfirmationData.set(null);
  }

  // ==================== MÉTODOS DEL MAPA ====================

  ngAfterViewInit() {
    // El mapa se inicializa cuando se abre el modal
  }

  ngOnDestroy() {
    this.destroyMap();
    if (this.geocodingTimeout) {
      clearTimeout(this.geocodingTimeout);
    }
  }

  openMapModal() {
    // Copiar la dirección actual al campo temporal
    this.customerInfo.direccionTemporal = this.customerInfo.direccion;
    this.locationErrorMessage.set('');
    this.showMapModal.set(true);
    // Pequeño delay para asegurar que el DOM esté listo
    setTimeout(() => {
      this.initMap();
    }, 100);
  }

  closeMapModal() {
    // Restaurar la dirección original si se cancela
    this.customerInfo.direccionTemporal = '';
    this.locationErrorMessage.set('');
    this.showMapModal.set(false);
    this.destroyMap();
  }

  confirmMapLocation() {
    // Validar que la dirección esté en Bogotá antes de confirmar
    if (this.locationErrorMessage()) {
      return; // No permitir confirmar si hay error
    }
    
    if (!this.customerInfo.direccionTemporal.trim()) {
      this.locationErrorMessage.set('Por favor, selecciona una ubicación en el mapa o escribe una dirección');
      return;
    }

    // Confirmar la dirección temporal como la dirección final
    this.customerInfo.direccion = this.customerInfo.direccionTemporal;
    this.closeMapModalWithConfirmation();
  }

  private closeMapModalWithConfirmation() {
    this.customerInfo.direccionTemporal = '';
    this.locationErrorMessage.set('');
    this.showMapModal.set(false);
    this.destroyMap();
  }

  // Validar si las coordenadas están dentro de Bogotá
  private isInBogota(lat: number, lng: number): boolean {
    return lat >= this.bogotaBounds.south && 
           lat <= this.bogotaBounds.north && 
           lng >= this.bogotaBounds.west && 
           lng <= this.bogotaBounds.east;
  }

  private initMap() {
    if (this.map) {
      this.destroyMap();
    }

    // Usar coordenadas seleccionadas o coordenadas por defecto
    const initialCoords = this.selectedCoordinates || this.defaultCoords;

    // Crear el mapa con límites máximos para Bogotá
    this.map = L.map('map-container', {
      center: [initialCoords.lat, initialCoords.lng],
      zoom: 13,
      maxBounds: [
        [this.bogotaBounds.south - 0.05, this.bogotaBounds.west - 0.05],
        [this.bogotaBounds.north + 0.05, this.bogotaBounds.east + 0.05]
      ],
      maxBoundsViscosity: 0.8
    });

    // Agregar capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
      minZoom: 11
    }).addTo(this.map);

    // Agregar rectángulo visual para mostrar los límites de Bogotá
    L.rectangle([
      [this.bogotaBounds.south, this.bogotaBounds.west],
      [this.bogotaBounds.north, this.bogotaBounds.east]
    ], {
      color: '#28a745',
      weight: 2,
      fillOpacity: 0.05,
      dashArray: '5, 10',
      interactive: false // No permitir interacción con el rectángulo
    }).addTo(this.map);

    // Configurar ícono personalizado del marcador
    const customIcon = L.icon({
      iconUrl: 'assets/leaflet/marker-icon.png',
      iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
      shadowUrl: 'assets/leaflet/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // Crear marcador inicial
    this.marker = L.marker([initialCoords.lat, initialCoords.lng], {
      icon: customIcon,
      draggable: true
    }).addTo(this.map);

    // Evento cuando se arrastra el marcador
    this.marker.on('dragend', () => {
      if (this.marker) {
        const position = this.marker.getLatLng();
        this.selectedCoordinates = { lat: position.lat, lng: position.lng };
        this.reverseGeocode(position.lat, position.lng);
      }
    });

    // Evento click en el mapa para mover el marcador
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      if (this.marker) {
        this.marker.setLatLng(e.latlng);
        this.selectedCoordinates = { lat: e.latlng.lat, lng: e.latlng.lng };
        this.reverseGeocode(e.latlng.lat, e.latlng.lng);
      }
    });

    // Si hay una dirección temporal, intentar geocodificarla
    if (this.customerInfo.direccionTemporal.trim()) {
      this.geocodeAddressFromModal(this.customerInfo.direccionTemporal);
    }
  }

  private destroyMap() {
    if (this.map) {
      this.map.remove();
      this.map = null;
      this.marker = null;
    }
  }

  // Geocodificación desde el modal: convertir dirección a coordenadas
  private geocodeAddressFromModal(address: string) {
    if (!address.trim() || !this.map || !this.marker) return;

    this.isLoadingLocation.set(true);
    this.locationErrorMessage.set('');
    const searchQuery = encodeURIComponent(`${address}, Bogotá, Colombia`);
    
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}&limit=1&countrycodes=co`)
      .then(response => response.json())
      .then(data => {
        this.isLoadingLocation.set(false);
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          
          // Validar que esté en Bogotá
          if (!this.isInBogota(lat, lng)) {
            this.locationErrorMessage.set('Esta dirección está fuera de Bogotá. Solo realizamos entregas en Bogotá.');
            return;
          }
          
          this.selectedCoordinates = { lat, lng };
          this.locationErrorMessage.set('');
          
          if (this.map && this.marker) {
            this.map.setView([lat, lng], 15);
            this.marker.setLatLng([lat, lng]);
          }
        } else {
          this.locationErrorMessage.set('No se encontró la dirección. Por favor, verifica que sea una dirección válida en Bogotá.');
        }
      })
      .catch(error => {
        console.error('Error en geocodificación:', error);
        this.isLoadingLocation.set(false);
        this.locationErrorMessage.set('Error al buscar la dirección. Por favor, intenta nuevamente.');
      });
  }

  // Geocodificación inversa: convertir coordenadas a dirección
  private reverseGeocode(lat: number, lng: number) {
    // Validar que esté en Bogotá
    if (!this.isInBogota(lat, lng)) {
      this.locationErrorMessage.set('Esta ubicación está fuera de Bogotá. Solo realizamos entregas en Bogotá.');
      this.isLoadingLocation.set(false);
      return;
    }

    this.isLoadingLocation.set(true);
    this.locationErrorMessage.set('');
    
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)
      .then(response => response.json())
      .then(data => {
        this.isLoadingLocation.set(false);
        if (data && data.display_name) {
          // Extraer dirección relevante
          const address = data.address;
          let formattedAddress = '';
          
          if (address.road) {
            formattedAddress += address.road;
            if (address.house_number) {
              formattedAddress += ' #' + address.house_number;
            }
          }
          
          if (address.neighbourhood || address.suburb) {
            formattedAddress += (formattedAddress ? ', ' : '') + (address.neighbourhood || address.suburb);
          }
          
          if (!formattedAddress) {
            formattedAddress = data.display_name.split(',').slice(0, 3).join(',');
          }
          
          // Actualizar la dirección temporal en el modal
          this.customerInfo.direccionTemporal = formattedAddress;
          this.locationErrorMessage.set('');
        }
      })
      .catch(error => {
        console.error('Error en geocodificación inversa:', error);
        this.isLoadingLocation.set(false);
        this.locationErrorMessage.set('Error al obtener la dirección. Por favor, intenta nuevamente.');
      });
  }

  // Detectar cambios en el campo de dirección temporal (en el modal)
  onAddressChangeInModal() {
    // Limpiar timeout anterior
    if (this.geocodingTimeout) {
      clearTimeout(this.geocodingTimeout);
    }

    // Esperar 1 segundo después de que el usuario deje de escribir
    this.geocodingTimeout = setTimeout(() => {
      if (this.customerInfo.direccionTemporal.trim() && this.map && this.marker) {
        this.geocodeAddressFromModal(this.customerInfo.direccionTemporal);
      }
    }, 1000);
  }

  // ==================== UTILIDADES ====================

  formatearMoneda(valor: number): string {
    return this.pedidoManager.formatearMoneda(valor);
  }

  getTotal(): number {
    return this.cartSummary()?.total || 0;
  }
}
