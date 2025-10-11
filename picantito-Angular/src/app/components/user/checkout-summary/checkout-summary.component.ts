import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';
import { Producto } from '../../../models/producto';

@Component({
  selector: 'app-checkout-summary',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './checkout-summary.html',
  styleUrl: './checkout-summary.css'
})
export class CheckoutSummaryComponent {
  cartItems = signal<CartItem[]>([]);
  subtotal = signal(0);
  domicilioCost = signal(0);
  total = signal(0);
  isProcessingOrder = signal(false);

  // Formulario de datos adicionales
  customerInfo = {
    direccion: '',
    telefono: '',
    observaciones: ''
  };

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {
    // Verificar autenticación
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Verificar si hay items en el carrito
    effect(() => {
      const items = this.cartService.getCartItems()();
      if (items.length === 0) {
        // Si no hay items, redirigir a la tienda
        this.router.navigate(['/tienda']);
      } else {
        this.cartItems.set(items);
        this.subtotal.set(this.cartService.getSubtotal());
        this.domicilioCost.set(this.cartService.getDomicilioCost());
        this.total.set(this.cartService.getTotal());
      }
    });
  }

  // Actualizar cantidad de un producto
  updateQuantity(productoId: number, cantidad: number) {
    if (cantidad <= 0) {
      this.removeItem(productoId);
    } else {
      this.cartService.updateQuantity(productoId, cantidad);
    }
  }

  // Eliminar producto del carrito
  removeItem(productoId: number) {
    this.cartService.removeFromCart(productoId);
  }

  // Agregar adicional (placeholder para funcionalidad futura)
  editAdicionales(producto: Producto) {
    // TODO: Implementar modal o navegación para editar adicionales
    console.log('Editar adicionales para:', producto.nombre);
  }

  // Procesar la orden de compra
  async processOrder() {
    if (this.cartItems().length === 0) {
      return;
    }

    // Validar información del cliente
    if (!this.customerInfo.direccion.trim() || !this.customerInfo.telefono.trim()) {
      alert('Por favor completa la dirección y teléfono para continuar.');
      return;
    }

    // Validar si el usuario está logueado
    if (!this.authService.isLoggedIn()) {
      // Si no está logueado, mostrar mensaje y redirigir al login
      const shouldLogin = confirm('Debes iniciar sesión para continuar con la compra. ¿Deseas ir al login?');
      if (shouldLogin) {
        this.router.navigate(['/login'], {
          queryParams: { returnUrl: '/checkout-summary' }
        });
      }
      return;
    }

    // Si está logueado, redirigir al portal de pagos
    this.router.navigate(['/payment-portal']);
  }

  // Volver al carrito (cerrar esta página)
  goBackToCart() {
    this.router.navigate(['/tienda']);
  }

  // Continuar comprando
  continueShopping() {
    this.router.navigate(['/tienda']);
  }
}
