import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../../models/producto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private readonly API_URL = `${environment.apiUrl}/api/productos`;

  constructor(private http: HttpClient) {}

  // Obtener todos los productos
  getAllProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.API_URL);
  }

  // Obtener productos activos
  getProductosActivos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.API_URL}/activos`);
  }

  // Obtener producto por ID
  getProductoById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.API_URL}/${id}`);
  }

  // Obtener producto por nombre
  getProductoByName(name: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.API_URL}/name/${encodeURIComponent(name)}`);
  }

  // Crear nuevo producto
  crearProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.API_URL, producto);
  }

  // Actualizar producto
  actualizarProducto(id: number, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.API_URL}/${id}`, producto);
  }

  // Eliminar producto (desactivar)
  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  // ============== MÉTODOS DE COMPATIBILIDAD HACIA ATRÁS ==============
  // Estos métodos son para mantener funcionando los componentes existentes
  // mientras se migran a usar la API REST

  // Método síncrono que devuelve array vacío (temporal)
  getProductos(): Producto[] {
    console.warn('getProductos() es un método deprecated. Use getAllProductos() Observable');
    return [];
  }

  // Método para agregar producto (mapea a crearProducto)
  addProducto(producto: Omit<Producto, 'id'>): void {
    console.warn('addProducto() es un método deprecated. Use crearProducto() Observable');
    this.crearProducto(producto as Producto).subscribe({
      next: (result) => console.log('Producto creado:', result),
      error: (error) => console.error('Error creando producto:', error)
    });
  }

  // Método para actualizar producto (síncrono, temporal)
  updateProducto(id: number, producto: Partial<Producto>): boolean {
    console.warn('updateProducto() es un método deprecated. Use actualizarProducto() Observable');
    this.actualizarProducto(id, producto as Producto).subscribe({
      next: (result) => console.log('Producto actualizado:', result),
      error: (error) => console.error('Error actualizando producto:', error)
    });
    return true;
  }

  // Método para eliminar producto (síncrono, temporal)
  deleteProducto(id: number): boolean {
    console.warn('deleteProducto() es un método deprecated. Use eliminarProducto() Observable');
    this.eliminarProducto(id).subscribe({
      next: (result) => console.log('Producto eliminado:', result),
      error: (error) => console.error('Error eliminando producto:', error)
    });
    return true;
  }
}
