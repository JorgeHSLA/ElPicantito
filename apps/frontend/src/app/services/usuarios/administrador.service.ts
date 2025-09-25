import { Injectable, signal } from '@angular/core';
import { Administrador } from '../../models/administrador';
import { Producto } from '../../models/producto';
import { Adicional } from '../../models/adicional';
import { Usuario } from '../../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class AdministradorService {

  // Métodos de persistencia localStorage
  private loadFromStorage<T>(key: string, defaultValue: T[]): T[] {
    try {
      const stored = localStorage.getItem(`elpicantito_${key}`);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return defaultValue;
    }
  }

  private saveToStorage<T>(key: string, data: T[]): void {
    try {
      localStorage.setItem(`elpicantito_${key}`, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }

  private administradores: Administrador[] = [ 
    {
      id : 1,
      nombreCompleto : "Juan Perez",
      nombreUsuario : "juanp",
      telefono : "1234567890",
      correo : "pBv0L@example.com", 
      contrasenia : "password123"
    },
    {
      id : 2,
      nombreCompleto : "ADMIN",
      nombreUsuario : "ADMIN",
      telefono : "1234567899",
      correo : "ADMIN@example.com", 
      contrasenia : "ADMIN"
    }
  ];

  // Datos iniciales por defecto
  private defaultProductos: Producto[] = [
    {
      id: 1,
      nombre: 'Taco de Carne Asada',
      descripcion: 'Delicioso taco con carne asada a la parrilla',
      precio: 12.99,
      imagen: '/images/taco1.webp',
      calificacion: 5,
      disponible: true
    },
    {
      id: 2,
      nombre: 'Taco de Pollo',
      descripcion: 'Taco con pollo marinado y especias',
      precio: 10.99,
      imagen: '/images/taco2.webp',
      calificacion: 4,
      disponible: true
    },
    {
      id: 3,
      nombre: 'Taco Vegetariano',
      descripcion: 'Taco con verduras frescas y aguacate',
      precio: 9.99,
      imagen: '/images/taco3.webp',
      calificacion: 4,
      disponible: true
    }
  ];

  // Signal con persistencia en localStorage
  private productosData = signal<Producto[]>(this.loadFromStorage('productos', this.defaultProductos));

  private defaultAdicionales: Adicional[] = [
    {
      id: 1,
      nombre: 'Queso Extra',
      descripcion: 'Queso cheddar adicional',
      precio: 2.50,
      precioDeAdquisicion: 1.50,
      cantidad: 50,
      disponible: true
    },
    {
      id: 2,
      nombre: 'Aguacate',
      descripcion: 'Rebanadas de aguacate fresco',
      precio: 3.00,
      precioDeAdquisicion: 2.00,
      cantidad: 30,
      disponible: true
    },
    {
      id: 3,
      nombre: 'Jalapeños',
      descripcion: 'Jalapeños en escabeche',
      precio: 1.75,
      precioDeAdquisicion: 0.75,
      cantidad: 20,
      disponible: true
    }
  ];

  private adicionalesData = signal<Adicional[]>(this.loadFromStorage('adicionales', this.defaultAdicionales));

  private defaultUsuarios: Usuario[] = [
    {
      id: 1,
      nombreCompleto: 'Carlos López García',
      nombreUsuario: 'carlos.lopez',
      telefono: '3009876543',
      correo: 'carlos@email.com',
      contrasenia: 'password123'
    },
    {
      id: 2,
      nombreCompleto: 'Administrador Principal',
      nombreUsuario: 'admin',
      telefono: '3001234567',
      correo: 'admin@elpicantito.com',
      contrasenia: 'admin123'
    }
  ];

  private usuariosData = signal<Usuario[]>(this.loadFromStorage('usuarios', this.defaultUsuarios));

  // Métodos para administradores
  getAdministradores(): Administrador[] {
    return this.administradores;
  }

  // Métodos para productos
  getProductos() {
    return this.productosData.asReadonly();
  }

  saveProducto(producto: Producto) {
    const productos = this.productosData();
    if (producto.id) {
      // Actualizar
      const index = productos.findIndex(p => p.id === producto.id);
      if (index !== -1) {
        productos[index] = producto;
      }
    } else {
      // Crear nuevo
      producto.id = Math.max(...productos.map(p => p.id || 0)) + 1;
      productos.push(producto);
    }
    const nuevosProductos = [...productos];
    this.productosData.set(nuevosProductos);
    this.saveToStorage('productos', nuevosProductos);
  }

  deleteProducto(id: number) {
    const productos = this.productosData().filter(p => p.id !== id);
    this.productosData.set(productos);
    this.saveToStorage('productos', productos);
  }

  getProductoById(id: number) {
    return this.productosData().find(p => p.id === id);
  }

  // Métodos para adicionales
  getAdicionales() {
    return this.adicionalesData.asReadonly();
  }

  saveAdicional(adicional: Adicional) {
    const adicionales = this.adicionalesData();
    if (adicional.id) {
      const index = adicionales.findIndex(a => a.id === adicional.id);
      if (index !== -1) {
        adicionales[index] = adicional;
      }
    } else {
      adicional.id = Math.max(...adicionales.map(a => a.id || 0)) + 1;
      adicionales.push(adicional);
    }
    const nuevosAdicionales = [...adicionales];
    this.adicionalesData.set(nuevosAdicionales);
    this.saveToStorage('adicionales', nuevosAdicionales);
  }

  deleteAdicional(id: number) {
    const adicionales = this.adicionalesData().filter(a => a.id !== id);
    this.adicionalesData.set(adicionales);
    this.saveToStorage('adicionales', adicionales);
  }

  getAdicionalById(id: number) {
    return this.adicionalesData().find(a => a.id === id);
  }

  // Métodos para usuarios
  getUsuarios() {
    return this.usuariosData.asReadonly();
  }

  saveUsuario(usuario: Usuario) {
    const usuarios = this.usuariosData();
    if (usuario.id) {
      const index = usuarios.findIndex(u => u.id === usuario.id);
      if (index !== -1) {
        usuarios[index] = usuario;
      }
    } else {
      usuario.id = Math.max(...usuarios.map(u => u.id || 0)) + 1;
      usuarios.push(usuario);
    }
    const nuevosUsuarios = [...usuarios];
    this.usuariosData.set(nuevosUsuarios);
    this.saveToStorage('usuarios', nuevosUsuarios);
  }

  deleteUsuario(id: number) {
    const usuarios = this.usuariosData().filter(u => u.id !== id);
    this.usuariosData.set(usuarios);
    this.saveToStorage('usuarios', usuarios);
  }

  getUserById(id: number) {
    return this.usuariosData().find(u => u.id === id);
  }
}
