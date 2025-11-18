import { Component, effect, signal, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../../services/carrito.service';
import { PedidoManagerService } from '../../../services/tienda/pedido-manager.service';
import { PedidoRestService } from '../../../services/tienda/pedido-rest.service';
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

  // Direcciones recientes
  direccionesRecientes = signal<string[]>([]);
  mostrarDireccionesRecientes = signal(false);

  // Mapa y ubicación
  showMapModal = signal(false);
  private map: L.Map | null = null;
  private marker: L.Marker | null = null;
  private geocodingTimeout: any = null;
  selectedCoordinates: { lat: number, lng: number } | null = null;
  isLoadingLocation = signal(false);
  locationErrorMessage = signal<string>('');
  isLocationValid = signal(false); // Para habilitar/deshabilitar botón de confirmar
  
  // Coordenadas por defecto (Bogotá, Colombia - Centro)
  private defaultCoords = { lat: 4.6097, lng: -74.0817 };
  
  // Límites de Bogotá (aproximados)
  private bogotaBounds = {
    north: 4.8347,
    south: 4.4711,
    east: -73.9937,
    west: -74.2239
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
    private pedidoRestService: PedidoRestService,
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
      // Scroll automático al contenedor de errores
      setTimeout(() => {
        const errorContainer = document.querySelector('.alert-danger');
        if (errorContainer) {
          errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }

    console.log('🔄 Procesando pedido...');
    console.log('📤 Dirección enviada al backend:', this.customerInfo.direccion);
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
        
        // Navegar al pedido específico después de 1.5 segundos
        const clienteId = this.authService.loggedUser()?.id;
        setTimeout(() => {
          this.closeOrderConfirmationModal();
          // Redirigir a la página de pedidos del cliente con parámetro de éxito
          if (clienteId) {
            this.router.navigate([`/cliente/${clienteId}/pedidos`], {
              queryParams: { pedidoCreado: pedidoCreado.id }
            });
          } else {
            this.router.navigate(['/pedidos'], {
              queryParams: { pedidoCreado: pedidoCreado.id }
            });
          }
        }, 1500);
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
    console.log('📞 Usuario completo:', usuario);
    console.log('📞 Teléfono del usuario:', usuario?.telefono);
    if (usuario) {
      // Cargar teléfono y correo del usuario
      this.customerInfo.telefono = usuario.telefono || '';
      this.customerInfo.correo = usuario.correo || '';
      console.log('📞 customerInfo después de cargar:', this.customerInfo);
      // Guardar valores originales
      this.telefonoOriginal = this.customerInfo.telefono;
      this.correoOriginal = this.customerInfo.correo;
      
      // Cargar direcciones recientes
      this.cargarDireccionesRecientes();
    }
  }

  cargarDireccionesRecientes() {
    const usuario = this.authService.loggedUser();
    if (usuario?.id) {
      this.pedidoRestService.getByCliente(Number(usuario.id)).subscribe({
        next: (pedidos) => {
          // Extraer direcciones únicas (sin coordenadas) de los pedidos
          const direcciones = pedidos
            .map(p => p.direccion || '')
            .filter(dir => dir.trim() !== '')
            .map(dir => this.getDireccionSinCoordenadas(dir))
            .filter((dir, index, self) => self.indexOf(dir) === index) // Eliminar duplicados
            .slice(0, 5); // Máximo 5 direcciones
          
          this.direccionesRecientes.set(direcciones);
        },
        error: (err) => {
          console.error('Error al cargar direcciones recientes:', err);
        }
      });
    }
  }

  seleccionarDireccionReciente(direccion: string) {
    // Buscar el pedido con esta dirección para obtener las coordenadas
    const usuario = this.authService.loggedUser();
    if (usuario?.id) {
      this.pedidoRestService.getByCliente(Number(usuario.id)).subscribe({
        next: (pedidos) => {
          const pedidoConDireccion = pedidos.find(p => 
            this.getDireccionSinCoordenadas(p.direccion || '') === direccion
          );
          
          if (pedidoConDireccion && pedidoConDireccion.direccion) {
            // Usar la dirección completa con coordenadas
            this.customerInfo.direccion = pedidoConDireccion.direccion;
            this.customerInfo.direccionTemporal = pedidoConDireccion.direccion;
            this.mostrarDireccionesRecientes.set(false);
          }
        }
      });
    }
  }

  toggleDireccionesRecientes() {
    this.mostrarDireccionesRecientes.set(!this.mostrarDireccionesRecientes());
  }

  getDireccionSinCoordenadas(direccion: string): string {
    if (!direccion) return '';
    // Extraer solo la parte de la dirección sin coordenadas
    const partes = direccion.split('|');
    return partes[0].trim();
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
    // Extraer solo la parte de texto de la dirección (sin coordenadas previas)
    let direccionSinCoords = this.customerInfo.direccion;
    if (direccionSinCoords.includes('|')) {
      direccionSinCoords = direccionSinCoords.split('|')[0];
    }
    this.customerInfo.direccionTemporal = direccionSinCoords;
    this.locationErrorMessage.set('');
    this.isLocationValid.set(direccionSinCoords.trim().length > 0); // Habilitar si ya hay dirección
    this.showMapModal.set(true);
    
    // Inicializar el mapa después de que el DOM esté listo
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
    if (!this.customerInfo.direccionTemporal.trim()) {
      this.locationErrorMessage.set('Por favor, escribe una dirección');
      return;
    }

    console.log('🔍 ===== CONFIRMAR UBICACIÓN =====');
    console.log('📍 Dirección escrita:', this.customerInfo.direccionTemporal);
    console.log('🎯 Coordenadas encontradas:', this.selectedCoordinates);

    // Guardar dirección con coordenadas si las tenemos
    if (this.selectedCoordinates) {
      const coordsString = `|${this.selectedCoordinates.lat},${this.selectedCoordinates.lng}`;
      this.customerInfo.direccion = this.customerInfo.direccionTemporal + coordsString;
      console.log('✅ GUARDADO FINAL:', this.customerInfo.direccion);
    } else {
      // Si no hay coordenadas, solo guardar el texto
      this.customerInfo.direccion = this.customerInfo.direccionTemporal;
      console.log('⚠️ Guardado solo texto (sin coordenadas)');
    }
    
    this.closeMapModalWithConfirmation();
  }

  private closeMapModalWithConfirmation() {
    this.customerInfo.direccionTemporal = '';
    this.locationErrorMessage.set('');
    this.showMapModal.set(false);
    this.destroyMap();
  }



  private initMap() {
    if (this.map) {
      this.destroyMap();
    }

    // Usar coordenadas seleccionadas o coordenadas por defecto
    const initialCoords = this.selectedCoordinates || this.defaultCoords;

    // Crear el mapa sin restricciones geográficas
    this.map = L.map('map-container', {
      center: [initialCoords.lat, initialCoords.lng],
      zoom: 13
    });

    // Agregar capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
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

    // Crear marcador inicial (arrastrable y con eventos)
    this.marker = L.marker([initialCoords.lat, initialCoords.lng], {
      icon: customIcon,
      draggable: true
    }).addTo(this.map);

    // Evento cuando se arrastra el marcador
    this.marker.on('dragend', () => {
      if (this.marker) {
        const position = this.marker.getLatLng();
        if (this.isInBogota(position.lat, position.lng)) {
          this.selectedCoordinates = { lat: position.lat, lng: position.lng };
          this.reverseGeocode(position.lat, position.lng);
        } else {
          this.locationErrorMessage.set('Ubicación fuera de Bogotá');
          this.marker.setLatLng([this.selectedCoordinates?.lat || this.defaultCoords.lat, this.selectedCoordinates?.lng || this.defaultCoords.lng]);
        }
      }
    });

    // Evento click en el mapa
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      if (this.marker && this.isInBogota(e.latlng.lat, e.latlng.lng)) {
        this.marker.setLatLng(e.latlng);
        this.selectedCoordinates = { lat: e.latlng.lat, lng: e.latlng.lng };
        this.reverseGeocode(e.latlng.lat, e.latlng.lng);
      } else {
        this.locationErrorMessage.set('Ubicación fuera de Bogotá');
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

  private isInBogota(lat: number, lng: number): boolean {
    return lat >= this.bogotaBounds.south &&
           lat <= this.bogotaBounds.north &&
           lng >= this.bogotaBounds.west &&
           lng <= this.bogotaBounds.east;
  }

  // Geocodificación: convertir dirección escrita a coordenadas
  private geocodeAddressFromModal(address: string) {
    if (!address.trim() || !this.map || !this.marker) return;

    this.isLoadingLocation.set(true);
    this.locationErrorMessage.set('');
    const searchQuery = encodeURIComponent(`${address}, Bogotá, Colombia`);
    
    console.log('🔍 Buscando dirección:', address);
    
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}&limit=1&countrycodes=co`)
      .then(response => response.json())
      .then(data => {
        this.isLoadingLocation.set(false);
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          
          if (!this.isInBogota(lat, lng)) {
            this.locationErrorMessage.set('La dirección está fuera de Bogotá');
            this.selectedCoordinates = null;
            this.isLocationValid.set(false); // Deshabilitar botón
            return;
          }
          
          // Guardar las coordenadas obtenidas
          this.selectedCoordinates = { lat, lng };
          console.log('✅ Coordenadas encontradas:', { lat, lng });
          console.log('✅ Dirección completa de Nominatim:', data[0].display_name);
          this.locationErrorMessage.set('');
          this.isLocationValid.set(true); // Habilitar botón de confirmar
          
          // Actualizar el mapa y marcador (solo visualización)
          if (this.map && this.marker) {
            this.map.setView([lat, lng], 15);
            this.marker.setLatLng([lat, lng]);
          }
        } else {
          this.locationErrorMessage.set('No se encontró la dirección. Por favor, verifica que sea válida.');
          this.selectedCoordinates = null;
          this.isLocationValid.set(false); // Deshabilitar botón
          console.log('❌ Dirección no encontrada');
        }
      })
      .catch(error => {
        console.error('❌ Error en geocodificación:', error);
        this.isLoadingLocation.set(false);
        this.locationErrorMessage.set('Error al buscar la dirección. Por favor, intenta nuevamente.');
        this.selectedCoordinates = null;
        this.isLocationValid.set(false); // Deshabilitar botón
      });
  }



  private reverseGeocode(lat: number, lng: number) {
    this.isLoadingLocation.set(true);
    
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)
      .then(response => response.json())
      .then(data => {
        this.isLoadingLocation.set(false);
        if (data && data.display_name) {
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
          
          this.customerInfo.direccionTemporal = formattedAddress;
          this.isLocationValid.set(true); // Habilitar botón
        }
      })
      .catch(error => {
        console.error('Error en reverseGeocode:', error);
        this.isLoadingLocation.set(false);
      });
  }

  // Detectar cambios en el campo de dirección (debounce para no buscar en cada tecla)
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

  // Método para obtener dirección sin coordenadas para mostrar al usuario
  getDireccionParaMostrar(): string {
    const direccion = this.customerInfo.direccion;
    if (direccion.includes('|')) {
      return direccion.split('|')[0];
    }
    return direccion;
  }

  formatearMoneda(valor: number): string {
    return this.pedidoManager.formatearMoneda(valor);
  }

  getTotal(): number {
    return this.cartSummary()?.total || 0;
  }
}
