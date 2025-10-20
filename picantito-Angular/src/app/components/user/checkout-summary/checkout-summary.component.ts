import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../../services/carrito.service';
import { PedidoManagerService } from '../../../services/tienda/pedido-manager.service';
import { AuthService } from '../../../services/auth.service';
import { CartItem, CartSummary } from '../../../models/cart-item';

@Component({
  selector: 'app-checkout-summary',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './checkout-summary.html',
  styleUrl: './checkout-summary.css'
})
export class CheckoutSummaryComponent {
  cartItems = signal<CartItem[]>([]);
  cartSummary = signal<CartSummary | null>(null);
  subtotal = signal(0);
  total = signal(0);
  isProcessingOrder = signal(false);

  // Formulario de datos adicionales
  customerInfo = {
    direccion: '',
    telefono: '',
    observaciones: ''
  };

  erroresValidacion: string[] = [];

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
      this.erroresValidacion.push('La dirección de entrega es obligatoria');
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
        
        alert(`¡Pedido confirmado! 
        Número de pedido: ${pedidoCreado.id}
        Total: ${this.formatearMoneda(summary!.total)}
        
        Recibirás una confirmación pronto.`);
        
        this.router.navigate(['/rastreo-pedido'], { 
          queryParams: { pedidoId: pedidoCreado.id } 
        });
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

  // ==================== UTILIDADES ====================

  formatearMoneda(valor: number): string {
    return this.pedidoManager.formatearMoneda(valor);
  }

  getTotal(): number {
    return this.cartSummary()?.total || 0;
  }
}
