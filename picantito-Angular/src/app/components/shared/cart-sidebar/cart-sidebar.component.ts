import { Component, effect, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CarritoService } from '../../../services/carrito.service';
import { AuthService } from '../../../services/auth.service';
import { CartItem, CartSummary } from '../../../models/cart-item';

@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-sidebar.html',
  styleUrl: './cart-sidebar.css'
})
export class CartSidebarComponent {
  cartItems = signal<CartItem[]>([]);
  cartSummary = signal<CartSummary | null>(null);
  isVisible = signal(false);
  totalItems = signal(0);
  total = signal(0);
  isAuthenticated = signal(false);

  constructor(
    private carritoService: CarritoService,
    private router: Router,
    private authService: AuthService
  ) {
    // Suscribirse al carrito con adicionales (sistema principal)
    effect(() => {
      this.cartItems.set(this.carritoService.cartItems());
      this.cartSummary.set(this.carritoService.getCartSummary());
      
      // Actualizar totales desde el resumen del carrito
      const summary = this.cartSummary();
      if (summary) {
        this.totalItems.set(summary.cantidadTotal);
        this.total.set(summary.total);
      } else {
        this.totalItems.set(0);
        this.total.set(0);
      }
    });

    // Suscribirse a la visibilidad del carrito
    effect(() => {
      this.isVisible.set(this.carritoService.isCartVisible());
    });

    // Suscribirse al estado de autenticación
    effect(() => {
      this.isAuthenticated.set(this.authService.isLoggedIn());
    });

    // Suscribirse al estado de autenticación
    effect(() => {
      this.isAuthenticated.set(this.authService.isLoggedIn());
    });
  }

  // Control de visibilidad del carrito
  showCart() {
    this.carritoService.showCart();
  }

  hideCart() {
    this.carritoService.hideCart();
  }

  toggleCart() {
    this.carritoService.toggleCart();
  }

  // Cerrar carrito con tecla ESC
  @HostListener('document:keydown.escape')
  onEscapeKey() {
    if (this.isVisible()) {
      this.closeCart();
    }
  }

  closeCart() {
    this.carritoService.hideCart();
  }

  // Métodos de carrito simplificados (usar solo CarritoService)
  removeItem(itemId: string) {
    this.carritoService.removerCartItem(itemId);
  }

  updateQuantity(itemId: string, cantidad: number) {
    this.carritoService.actualizarCantidadCartItem(itemId, cantidad);
  }

  clearCart() {
    this.carritoService.limpiarCarritoCompleto();
  }

  // Obtener total de items
  getTotalItemsCount(): number {
    return this.totalItems();
  }

  // Obtener total del carrito
  getTotalAmount(): number {
    return this.total();
  }

  proceedToCheckout() {
    // Cerrar el carrito y navegar a la página de resumen
    this.closeCart();
    this.router.navigate(['/checkout-summary']);
  }

  goToLogin() {
    this.closeCart();
    this.router.navigate(['/login']);
  }

  // Compatibilidad temporal para métodos antiguos
  removeItemOld(productoId: number) {
    this.carritoService.removerItem(productoId);
  }

  updateQuantityOld(productoId: number, cantidad: number) {
    this.carritoService.actualizarCantidad(productoId, cantidad);
  }
}
