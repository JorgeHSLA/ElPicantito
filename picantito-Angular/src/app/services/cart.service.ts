import { Injectable, signal } from '@angular/core';
import { Producto } from '../models/producto';
import { AuthService } from './auth.service';

export interface CartItem {
  producto: Producto;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);
  private isCartOpen = signal(false);
  private readonly DOMICILIO_COST = 5000;

  constructor(private authService: AuthService) {
    this.loadCartFromStorage();
    
    // Limpiar carrito si el usuario no está autenticado
    if (!this.authService.isLoggedIn()) {
      this.cartItems.set([]);
    }
  }

  // Getters para los signals
  getCartItems() {
    return this.cartItems.asReadonly();
  }

  isCartVisible() {
    return this.isCartOpen.asReadonly();
  }

  // Abrir/cerrar carrito
  toggleCart() {
    this.isCartOpen.update(isOpen => !isOpen);
  }

  closeCart() {
    this.isCartOpen.set(false);
  }

  openCart() {
    this.isCartOpen.set(true);
  }

  // Agregar producto al carrito
  addToCart(producto: Producto, cantidad: number = 1): boolean {
    // Verificar si el usuario está autenticado
    if (!this.authService.isLoggedIn()) {
      return false; // Retornar false si no está autenticado
    }

    const currentItems = this.cartItems();
    const existingItemIndex = currentItems.findIndex(item => item.producto.id === producto.id);

    if (existingItemIndex >= 0) {
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex].cantidad += cantidad;
      this.cartItems.set(updatedItems);
    } else {
      this.cartItems.update(items => [...items, { producto, cantidad }]);
    }

    this.saveCartToStorage();
    return true; // Retornar true si se agregó exitosamente
  }

  // Remover producto del carrito
  removeFromCart(productoId: number) {
    // Verificar autenticación antes de remover
    if (!this.authService.isLoggedIn()) {
      return;
    }
    
    this.cartItems.update(items => items.filter(item => item.producto.id !== productoId));
    this.saveCartToStorage();
  }

  // Actualizar cantidad de un producto
  updateQuantity(productoId: number, cantidad: number) {
    // Verificar autenticación antes de actualizar
    if (!this.authService.isLoggedIn()) {
      return;
    }

    if (cantidad <= 0) {
      this.removeFromCart(productoId);
      return;
    }

    this.cartItems.update(items =>
      items.map(item =>
        item.producto.id === productoId
          ? { ...item, cantidad }
          : item
      )
    );
    this.saveCartToStorage();
  }

  // Limpiar carrito
  clearCart() {
    // Verificar autenticación antes de limpiar
    if (!this.authService.isLoggedIn()) {
      return;
    }
    
    this.cartItems.set([]);
    this.saveCartToStorage();
  }

  // Obtener total de items
  getTotalItems(): number {
    return this.cartItems().reduce((total, item) => total + item.cantidad, 0);
  }

  // Obtener subtotal del precio
  getSubtotal(): number {
    return this.cartItems().reduce((total, item) =>
      total + (item.producto.precio || 0) * item.cantidad, 0
    );
  }

  // Obtener costo de domicilio
  getDomicilioCost(): number {
    return this.cartItems().length > 0 ? this.DOMICILIO_COST : 0;
  }

  // Obtener total final
  getTotal(): number {
    return this.getSubtotal() + this.getDomicilioCost();
  }

  // Verificar si el usuario está autenticado
  isUserAuthenticated(): boolean {
    return this.authService.isLoggedIn();
  }

  // Limpiar carrito cuando se cierre sesión (llamado externamente)
  clearCartOnLogout(): void {
    this.cartItems.set([]);
    localStorage.removeItem('cart');
  }

  // Guardar en localStorage
  private saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems()));
  }

  // Cargar desde localStorage
  private loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        this.cartItems.set(cartData);
      } catch (error) {
        console.error('Error loading cart from storage:', error);
      }
    }
  }
}
