import { Injectable, signal } from '@angular/core';
import { Administrador } from '../../models/administrador';
import { Producto } from '../../models/producto';
import { Adicional } from '../../models/adicional';
import { Usuario } from '../../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class AdministradorService {
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

  private readonly STORAGE_KEY_PRODUCTOS = 'admin_productos';
  private readonly STORAGE_KEY_ADICIONALES = 'admin_adicionales';
  private readonly STORAGE_KEY_USUARIOS = 'admin_usuarios';

  private load<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  }
  private save<T>(key: string, data: T) {
    try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
  }

  // Replace initial signals assignment with persisted versions
  private productosData = signal<Producto[]>(
    this.load<Producto[]>(this.STORAGE_KEY_PRODUCTOS, [
      { id: 1, nombre: 'Taco de Carne Asada', descripcion: 'Delicioso taco con carne asada a la parrilla', precio: 12.99, imagen: '/images/taco1.webp', calificacion: 5, disponible: true },
      { id: 2, nombre: 'Taco de Pollo', descripcion: 'Taco con pollo marinado y especias', precio: 10.99, imagen: '/images/taco2.webp', calificacion: 4, disponible: true },
      { id: 3, nombre: 'Taco Vegetariano', descripcion: 'Taco con verduras frescas y aguacate', precio: 9.99, imagen: '/images/taco3.webp', calificacion: 4, disponible: true }
    ])
  );

  private adicionalesData = signal<Adicional[]>(
    this.load<Adicional[]>(this.STORAGE_KEY_ADICIONALES, [
      { id: 1, nombre: 'Queso Extra', descripcion: 'Queso cheddar adicional', precio: 2.50, precioDeAdquisicion: 1.50, cantidad: 50, disponible: true },
      { id: 2, nombre: 'Aguacate', descripcion: 'Rebanadas de aguacate fresco', precio: 3.00, precioDeAdquisicion: 2.00, cantidad: 30, disponible: true },
      { id: 3, nombre: 'Jalapeños', descripcion: 'Jalapeños en escabeche', precio: 1.75, precioDeAdquisicion: 0.75, cantidad: 20, disponible: true }
    ])
  );

  private usuariosData = signal<Usuario[]>(
    this.load<Usuario[]>(this.STORAGE_KEY_USUARIOS, [
      { id: 1, nombreCompleto: 'Carlos López García', nombreUsuario: 'carlos.lopez', telefono: '3009876543', correo: 'carlos@email.com', contrasenia: 'password123' },
      { id: 2, nombreCompleto: 'Administrador Principal', nombreUsuario: 'admin', telefono: '3001234567', correo: 'admin@elpicantito.com', contrasenia: 'admin123' }
    ])
  );

  // Métodos para administradores
  getAdministradores(): Administrador[] {
    return this.administradores;
  }

  // Métodos para productos
  getProductos() { return this.productosData.asReadonly(); }
  saveProducto(producto: Producto) {
    const productos = this.productosData();
    if (producto.id) {
      const i = productos.findIndex(p => p.id === producto.id);
      if (i !== -1) productos[i] = producto;
    } else {
      producto.id = Math.max(...productos.map(p => p.id || 0), 0) + 1;
      productos.push(producto);
    }
    const copia = [...productos];
    this.productosData.set(copia);
    this.save(this.STORAGE_KEY_PRODUCTOS, copia);
  }
  deleteProducto(id: number) {
    const copia = this.productosData().filter(p => p.id !== id);
    this.productosData.set(copia);
    this.save(this.STORAGE_KEY_PRODUCTOS, copia);
  }
  getProductoById(id: number) { return this.productosData().find(p => p.id === id); }

  // Métodos para adicionales
  getAdicionales() { return this.adicionalesData.asReadonly(); }
  saveAdicional(adicional: Adicional) {
    const adicionales = this.adicionalesData();
    if (adicional.id) {
      const i = adicionales.findIndex(a => a.id === adicional.id);
      if (i !== -1) adicionales[i] = adicional;
    } else {
      adicional.id = Math.max(...adicionales.map(a => a.id || 0), 0) + 1;
      adicionales.push(adicional);
    }
    const copia = [...adicionales];
    this.adicionalesData.set(copia);
    this.save(this.STORAGE_KEY_ADICIONALES, copia);
  }
  deleteAdicional(id: number) {
    const copia = this.adicionalesData().filter(a => a.id !== id);
    this.adicionalesData.set(copia);
    this.save(this.STORAGE_KEY_ADICIONALES, copia);
  }
  getAdicionalById(id: number) { return this.adicionalesData().find(a => a.id === id); }

  // Métodos para usuarios
  getUsuarios() { return this.usuariosData.asReadonly(); }
  saveUsuario(usuario: Usuario) {
    const usuarios = this.usuariosData();
    if (usuario.id) {
      const i = usuarios.findIndex(u => u.id === usuario.id);
      if (i !== -1) usuarios[i] = usuario;
    } else {
      usuario.id = Math.max(...usuarios.map(u => u.id || 0), 0) + 1;
      usuarios.push(usuario);
    }
    const copia = [...usuarios];
    this.usuariosData.set(copia);
    this.save(this.STORAGE_KEY_USUARIOS, copia);
  }
  deleteUsuario(id: number) {
    const copia = this.usuariosData().filter(u => u.id !== id);
    this.usuariosData.set(copia);
    this.save(this.STORAGE_KEY_USUARIOS, copia);
  }
  getUserById(id: number) { return this.usuariosData().find(u => u.id === id); }
}
