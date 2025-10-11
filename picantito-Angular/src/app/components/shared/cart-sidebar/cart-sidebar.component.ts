import { Component, effect, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService, CartItem } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-sidebar.html',
  styleUrl: './cart-sidebar.css'
})
export class CartSidebarComponent {
  cartItems = signal<CartItem[]>([]);
  isVisible = signal(false);
  totalItems = signal(0);
  subtotal = signal(0);
  domicilioCost = signal(0);
  total = signal(0);
  isAuthenticated = signal(false);

  constructor(
    private cartService: CartService, 
    private router: Router,
    private authService: AuthService
  ) {
    // Suscribirse a cambios del carrito
    effect(() => {
      this.cartItems.set(this.cartService.getCartItems()());
      this.totalItems.set(this.cartService.getTotalItems());
      this.subtotal.set(this.cartService.getSubtotal());
      this.domicilioCost.set(this.cartService.getDomicilioCost());
      this.total.set(this.cartService.getTotal());
    });

    // Suscribirse a la visibilidad del carrito
    effect(() => {
      this.isVisible.set(this.cartService.isCartVisible()());
    });

    // Suscribirse al estado de autenticación
    effect(() => {
      this.isAuthenticated.set(this.authService.isLoggedIn());
    });
  }

  // Cerrar carrito con tecla ESC
  @HostListener('document:keydown.escape')
  onEscapeKey() {
    if (this.isVisible()) {
      this.closeCart();
    }
  }

  closeCart() {
    this.cartService.closeCart();
  }

  removeItem(productoId: number) {
    this.cartService.removeFromCart(productoId);
  }

  updateQuantity(productoId: number, cantidad: number) {
    this.cartService.updateQuantity(productoId, cantidad);
  }

  clearCart() {
    this.cartService.clearCart();
  }

  proceedToCheckout() {
    // Cerrar el carrito y navegar a la página de resumen
    this.cartService.closeCart();
    this.router.navigate(['/checkout-summary']);
  }

  goToLogin() {
    this.cartService.closeCart();
    this.router.navigate(['/login']);
  }
}
