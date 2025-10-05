import { Injectable, signal } from '@angular/core';
import { Producto } from '../models/producto';

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private itemsSignal = signal<ItemCarrito[]>([]);
  
  // Getter público para el signal
  get items() {
    return this.itemsSignal.asReadonly();
  }

  constructor() {
    // Cargar carrito desde localStorage al inicializar
    this.loadCarritoFromStorage();
  }

  agregarItem(producto: Producto, cantidad: number = 1): void {
    const itemsActuales = this.itemsSignal();
    const itemExistente = itemsActuales.find(item => item.producto.id === producto.id);

    if (itemExistente) {
      // Si el producto ya existe, aumentar la cantidad
      itemExistente.cantidad += cantidad;
      itemExistente.subtotal = itemExistente.cantidad * (producto.precioDeVenta || producto.precio || 0);
    } else {
      // Si es un nuevo producto, agregarlo al carrito
      const nuevoItem: ItemCarrito = {
        producto,
        cantidad,
        subtotal: cantidad * (producto.precioDeVenta || producto.precio || 0)
      };
      itemsActuales.push(nuevoItem);
    }

    this.itemsSignal.set([...itemsActuales]);
    this.saveCarritoToStorage();
  }

  removerItem(productoId: number): void {
    const itemsActuales = this.itemsSignal();
    const itemsActualizados = itemsActuales.filter(item => item.producto.id !== productoId);
    this.itemsSignal.set(itemsActualizados);
    this.saveCarritoToStorage();
  }

  actualizarCantidad(productoId: number, nuevaCantidad: number): void {
    if (nuevaCantidad <= 0) {
      this.removerItem(productoId);
      return;
    }

    const itemsActuales = this.itemsSignal();
    const item = itemsActuales.find(item => item.producto.id === productoId);
    
    if (item) {
      item.cantidad = nuevaCantidad;
      item.subtotal = nuevaCantidad * (item.producto.precioDeVenta || item.producto.precio || 0);
      this.itemsSignal.set([...itemsActuales]);
      this.saveCarritoToStorage();
    }
  }

  limpiarCarrito(): void {
    this.itemsSignal.set([]);
    this.saveCarritoToStorage();
  }

  getCantidadTotal(): number {
    return this.itemsSignal().reduce((total, item) => total + item.cantidad, 0);
  }

  getTotal(): number {
    return this.itemsSignal().reduce((total, item) => total + item.subtotal, 0);
  }

  private saveCarritoToStorage(): void {
    localStorage.setItem('carrito', JSON.stringify(this.itemsSignal()));
  }

  private loadCarritoFromStorage(): void {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      try {
        const items = JSON.parse(carritoGuardado);
        this.itemsSignal.set(items);
      } catch (error) {
        console.error('Error al cargar carrito desde localStorage:', error);
        this.itemsSignal.set([]);
      }
    }
  }
}