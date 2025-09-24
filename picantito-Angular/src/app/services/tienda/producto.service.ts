import { Injectable, signal } from '@angular/core';
import { Producto } from '../../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  
  private readonly STORAGE_KEY = 'productos_picantito';
  
  private productosIniciales: Producto[] = [
    {
      id: 1,
      nombre: "Hamburguesa Clásica",
      descripcion: "Carne 100% res, pan artesanal, lechuga, tomate y queso cheddar.",
      precio: 18000,
      precioDeAdquisicion: 10000,
      imagen: "assets/img/hamburguesa_clasica.jpg",
      disponible: true,
      calificacion: 4
    },
    {
      id: 2,
      nombre: "Pizza Pepperoni",
      descripcion: "Pizza mediana con salsa napolitana, queso mozzarella y pepperoni.",
      precio: 25000,
      precioDeAdquisicion: 15000,
      imagen: "assets/img/pizza_pepperoni.jpg",
      disponible: true,
      calificacion: 5
    },
    {
      id: 3,
      nombre: "Perro Caliente",
      descripcion: "Pan suave, salchicha americana, papas ripio y salsas.",
      precio: 12000,
      precioDeAdquisicion: 7000,
      imagen: "assets/img/perro_caliente.jpg",
      disponible: false,
      calificacion: 3
    },
    {
      id: 4,
      nombre: "Ensalada César",
      descripcion: "Pollo a la plancha, lechuga romana, crutones y aderezo césar.",
      precio: 15000,
      precioDeAdquisicion: 8000,
      imagen: "assets/img/ensalada_cesar.jpg",
      disponible: true,
      calificacion: 4
    },
    {
      id: 5,
      nombre: "Tacos Mexicanos",
      descripcion: "Tortilla de maíz, carne al pastor, piña y guacamole.",
      precio: 20000,
      precioDeAdquisicion: 12000,
      imagen: "assets/img/tacos_mexicanos.jpg",
      disponible: true,
      calificacion: 5
    }
  ];

  private productosSignal = signal<Producto[]>(this.loadFromStorage());

  constructor() {
    // Si no hay datos en localStorage, usar los datos iniciales
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      this.saveToStorage(this.productosIniciales);
      this.productosSignal.set(this.productosIniciales);
    }
  }

  private loadFromStorage(): Producto[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : this.productosIniciales;
    } catch (error) {
      console.error('Error loading products from localStorage:', error);
      return this.productosIniciales;
    }
  }

  private saveToStorage(productos: Producto[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(productos));
    } catch (error) {
      console.error('Error saving products to localStorage:', error);
    }
  }

  getProductos() {
    return this.productosSignal();
  }

  getProductosSignal() {
    return this.productosSignal.asReadonly();
  }

  // CREATE
  addProducto(producto: Omit<Producto, 'id'>): Producto {
    const productos = this.productosSignal();
    const newId = Math.max(...productos.map(p => p.id || 0), 0) + 1;
    const newProducto: Producto = { ...producto, id: newId };
    
    const updatedProductos = [...productos, newProducto];
    this.productosSignal.set(updatedProductos);
    this.saveToStorage(updatedProductos);
    
    return newProducto;
  }

  // READ by ID
  getProductoById(id: number): Producto | undefined {
    return this.productosSignal().find(p => p.id === id);
  }

  // UPDATE
  updateProducto(id: number, producto: Partial<Producto>): boolean {
    const productos = this.productosSignal();
    const index = productos.findIndex(p => p.id === id);
    
    if (index === -1) return false;

    const updatedProducto = { ...productos[index], ...producto, id };
    const updatedProductos = [...productos];
    updatedProductos[index] = updatedProducto;
    
    this.productosSignal.set(updatedProductos);
    this.saveToStorage(updatedProductos);
    
    return true;
  }

  // DELETE
  deleteProducto(id: number): boolean {
    const productos = this.productosSignal();
    const exists = productos.some(p => p.id === id);
    
    if (!exists) return false;

    const updatedProductos = productos.filter(p => p.id !== id);
    this.productosSignal.set(updatedProductos);
    this.saveToStorage(updatedProductos);
    
    return true;
  }

  // Método para resetear a datos iniciales (opcional)
  resetToInitialData(): void {
    this.productosSignal.set(this.productosIniciales);
    this.saveToStorage(this.productosIniciales);
  }
}
