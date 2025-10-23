import { Injectable, signal } from '@angular/core';
import { Producto } from '../models/producto';
import { CartItem, AdicionalSeleccionado, CartSummary } from '../models/cart-item';
import { Adicional } from '../models/adicional';

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private cartItemsSignal = signal<CartItem[]>([]);
  private isCartVisibleSignal = signal(false);
  
  // Getter para items con adicionales (sistema principal)
  get cartItems() {
    return this.cartItemsSignal.asReadonly();
  }

  // Control de visibilidad del carrito
  get isCartVisible() {
    return this.isCartVisibleSignal.asReadonly();
  }

  showCart() {
    this.isCartVisibleSignal.set(true);
  }

  hideCart() {
    this.isCartVisibleSignal.set(false);
  }

  toggleCart() {
    this.isCartVisibleSignal.set(!this.isCartVisibleSignal());
  }

  // Métodos de compatibilidad para el sistema anterior
  get items() {
    // Convertir cartItems a formato ItemCarrito para compatibilidad
    const basicItems = this.cartItemsSignal().map(cartItem => ({
      producto: cartItem.producto,
      cantidad: cartItem.cantidad,
      subtotal: cartItem.subtotal
    }));
    return signal(basicItems).asReadonly();
  }

  constructor() {
    // Cargar carrito desde localStorage al inicializar
    this.loadCarritoFromStorage();
    this.migrateLegacyCartIfPresent();

    // Guardar siempre al cerrar/ocultar la pestaña
    window.addEventListener('beforeunload', () => {
      try { this.saveCarritoToStorage(); } catch {}
    });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        try { this.saveCarritoToStorage(); } catch {}
      }
    });
  }

  agregarItem(producto: Producto, cantidad: number = 1): void {
    // Usar directamente el sistema nuevo sin adicionales
    this.agregarItemConAdicionales(producto, cantidad, []);
  }

  removerItem(productoId: number): void {
    // Remover todos los items que contengan este producto
    const itemsActuales = this.cartItemsSignal();
    const itemsActualizados = itemsActuales.filter(item => item.producto.id !== productoId);
    this.cartItemsSignal.set(itemsActualizados);
    this.saveCarritoToStorage();
  }

  actualizarCantidad(productoId: number, nuevaCantidad: number): void {
    if (nuevaCantidad <= 0) {
      this.removerItem(productoId);
      return;
    }

    // Actualizar el primer item encontrado con ese producto
    const itemsActuales = this.cartItemsSignal();
    const item = itemsActuales.find(item => item.producto.id === productoId);
    
    if (item) {
      item.cantidad = nuevaCantidad;
      item.subtotal = this.calcularSubtotalItem(item);
      this.cartItemsSignal.set([...itemsActuales]);
      this.saveCarritoToStorage();
    }
  }

  limpiarCarrito(): void {
    this.cartItemsSignal.set([]);
    this.saveCarritoToStorage();
  }

  getCantidadTotal(): number {
    return this.cartItemsSignal().reduce((total, item) => total + item.cantidad, 0);
  }

  getTotal(): number {
    return this.cartItemsSignal().reduce((total, item) => total + item.subtotal, 0);
  }

  // ==================== MÉTODOS NUEVOS PARA MANEJO DE ADICIONALES ====================

  /**
   * Agregar producto con adicionales al carrito
   */
  agregarItemConAdicionales(
    producto: Producto, 
    cantidad: number = 1, 
    adicionales: AdicionalSeleccionado[] = []
  ): void {
    console.log('🛒 AGREGANDO AL CARRITO:', {
      producto: producto.nombre,
      cantidad,
      adicionales: adicionales.length,
      id: producto.id
    });

    const itemId = this.generateItemId(producto, adicionales);
    console.log('🆔 ID generado:', itemId);
    
    const itemsActuales = this.cartItemsSignal();
    console.log('📦 Items actuales en carrito:', itemsActuales.length);
    
    const itemExistente = itemsActuales.find(item => item.id === itemId);
    console.log('🔍 Item existente encontrado:', !!itemExistente);

    const precioProducto = producto.precioDeVenta || producto.precio || 0;
    const subtotalAdicionales = adicionales.reduce((sum, ad) => sum + ad.subtotal, 0);
    const subtotalTotal = (precioProducto * cantidad) + (subtotalAdicionales * cantidad);

    if (itemExistente) {
      // Si el item exacto ya existe (mismo producto + mismos adicionales), aumentar cantidad
      console.log('⬆️ Aumentando cantidad del item existente');
      itemExistente.cantidad += cantidad;
      itemExistente.subtotal = this.calcularSubtotalItem(itemExistente);
    } else {
      // Crear nuevo item
      console.log('➕ Creando nuevo item en carrito');
      const nuevoItem: CartItem = {
        id: itemId,
        producto,
        cantidad,
        adicionales: adicionales.map(ad => ({ ...ad })), // Clonar adicionales
        subtotal: subtotalTotal
      };
      itemsActuales.push(nuevoItem);
    }

    this.cartItemsSignal.set([...itemsActuales]);
    console.log('✅ Carrito actualizado. Total items:', this.cartItemsSignal().length);
    console.log('📋 Items en carrito:', this.cartItemsSignal().map(i => ({ id: i.id, producto: i.producto.nombre, cantidad: i.cantidad })));
    
    this.saveCarritoToStorage();
  }

  /**
   * Generar ID único para un item basado en producto y adicionales
   */
  private generateItemId(producto: Producto, adicionales: AdicionalSeleccionado[]): string {
    const adicionalesIds = adicionales
      .map(ad => `${ad.adicional.id}_${ad.cantidad}`)
      .sort()
      .join('|');
    
    // Si no hay adicionales, usar solo el ID del producto (permitir combinación)
    if (adicionales.length === 0) {
      return `producto_${producto.id}_sin_adicionales`;
    }
    
    // Si hay adicionales, crear ID único con producto + adicionales específicos
    return `producto_${producto.id}_con_adicionales_${adicionalesIds}`;
  }

  /**
   * Calcular subtotal de un item incluyendo adicionales
   */
  private calcularSubtotalItem(item: CartItem): number {
    const precioProducto = item.producto.precioDeVenta || item.producto.precio || 0;
    const subtotalProductos = precioProducto * item.cantidad;
    
    const subtotalAdicionales = item.adicionales.reduce((sum, adicional) => {
      const precioAdicional = adicional.adicional.precioDeVenta || adicional.adicional.precio || 0;
      return sum + (precioAdicional * adicional.cantidad * item.cantidad);
    }, 0);

    return subtotalProductos + subtotalAdicionales;
  }

  /**
   * Remover item específico del carrito
   */
  removerCartItem(itemId: string): void {
    const itemsActuales = this.cartItemsSignal();
    const itemsActualizados = itemsActuales.filter(item => item.id !== itemId);
    this.cartItemsSignal.set(itemsActualizados);
    this.saveCarritoToStorage();
  }

  /**
   * Actualizar cantidad de un item específico
   */
  actualizarCantidadCartItem(itemId: string, nuevaCantidad: number): void {
    if (nuevaCantidad <= 0) {
      this.removerCartItem(itemId);
      return;
    }

    const itemsActuales = this.cartItemsSignal();
    const item = itemsActuales.find(item => item.id === itemId);
    
    if (item) {
      item.cantidad = nuevaCantidad;
      item.subtotal = this.calcularSubtotalItem(item);
      this.cartItemsSignal.set([...itemsActuales]);
      this.saveCarritoToStorage();
    }
  }

  /**
   * Obtener resumen completo del carrito
   */
  getCartSummary(): CartSummary {
    const items = this.cartItemsSignal();
    
    const cantidadTotal = items.reduce((total, item) => total + item.cantidad, 0);
    
    const subtotalProductos = items.reduce((total, item) => {
      const precioProducto = item.producto.precioDeVenta || item.producto.precio || 0;
      return total + (precioProducto * item.cantidad);
    }, 0);

    const subtotalAdicionales = items.reduce((total, item) => {
      return total + item.adicionales.reduce((sum, adicional) => {
        const precioAdicional = adicional.adicional.precioDeVenta || adicional.adicional.precio || 0;
        return sum + (precioAdicional * adicional.cantidad * item.cantidad);
      }, 0);
    }, 0);

    const total = subtotalProductos + subtotalAdicionales;

    return {
      items,
      cantidadTotal,
      subtotalProductos,
      subtotalAdicionales,
      total
    };
  }

  /**
   * Limpiar carrito completo
   */
  limpiarCarritoCompleto(): void {
    this.cartItemsSignal.set([]);
    this.saveCarritoToStorage();
  }

  // ==================== MÉTODOS DE STORAGE SIMPLIFICADOS ====================

  private saveCarritoToStorage(): void {
    // Solo guardar los cartItems (sistema principal)
    localStorage.setItem('carrito', JSON.stringify(this.cartItemsSignal()));
  }

  private loadCarritoFromStorage(): void {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      try {
        const data = JSON.parse(carritoGuardado);
        
        // Si es el formato nuevo (array de CartItem)
        if (Array.isArray(data) && (data.length === 0 || data[0].id)) {
          this.cartItemsSignal.set(data);
        }
        // Si es el formato anterior con objetos separados
        else if (data.cartItems && Array.isArray(data.cartItems)) {
          this.cartItemsSignal.set(data.cartItems);
        }
        // Si es el formato muy antiguo, limpiar y empezar de nuevo
        else {
          console.log('Formato de carrito obsoleto, iniciando carrito limpio');
          this.limpiarCarritoCompleto();
        }
      } catch (error) {
        console.error('Error al cargar carrito desde localStorage:', error);
        this.limpiarCarritoCompleto();
      }
    }
  }

  /**
   * Migrar desde la clave legacy 'cart' (CartService antiguo) al formato nuevo.
   */
  private migrateLegacyCartIfPresent(): void {
    const legacy = localStorage.getItem('cart');
    if (!legacy) return;

    try {
      const legacyItems: Array<{ producto: Producto; cantidad: number }> = JSON.parse(legacy);
      if (!Array.isArray(legacyItems) || legacyItems.length === 0) {
        localStorage.removeItem('cart');
        return;
      }

      const actuales = this.cartItemsSignal();
      const combinados: CartItem[] = [...actuales];

      for (const li of legacyItems) {
        if (!li?.producto?.id || !li?.cantidad) continue;
        const id = this.generateItemId(li.producto, []);
        const existente = combinados.find(i => i.id === id);
        if (existente) {
          existente.cantidad += li.cantidad;
          existente.subtotal = this.calcularSubtotalItem(existente);
        } else {
          const nuevo: CartItem = {
            id,
            producto: li.producto,
            cantidad: li.cantidad,
            adicionales: [],
            subtotal: (li.producto.precioDeVenta || li.producto.precio || 0) * li.cantidad
          };
          combinados.push(nuevo);
        }
      }

      this.cartItemsSignal.set(combinados);
      this.saveCarritoToStorage();
      localStorage.removeItem('cart');
      console.log('✔ Migrado carrito legacy (cart) al nuevo (carrito)');
    } catch (e) {
      console.warn('No se pudo migrar el carrito legacy:', e);
    }
  }

  // Método para forzar limpieza completa del carrito
  public limpiarTodoElSistema(): void {
    console.log('🧹 Limpiando completamente el sistema de carrito...');
    this.cartItemsSignal.set([]);
    localStorage.removeItem('carrito');
    // También limpiar cualquier resto del sistema antiguo
    localStorage.removeItem('cart');
    localStorage.removeItem('cartItems');
    console.log('✅ Sistema de carrito completamente limpio');
  }
}