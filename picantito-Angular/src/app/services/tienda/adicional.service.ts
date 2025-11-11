import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Adicional } from '../../models/adicional';
import { ProductoAdicional } from '../../models/producto-adicional';

@Injectable({
  providedIn: 'root'
})
export class AdicionalService {
  private readonly API_URL = 'http://localhost:9998/api/adicional';

  constructor(private http: HttpClient) {}

  // Obtener todos los adicionales
  getAllAdicionales(): Observable<Adicional[]> {
    return this.http.get<Adicional[]>(this.API_URL);
  }

  // Obtener adicional por ID
  getAdicionalById(id: number): Observable<Adicional> {
    return this.http.get<Adicional>(`${this.API_URL}/${id}`);
  }

  // Crear nuevo adicional
  crearAdicional(adicional: Adicional): Observable<Adicional> {
    return this.http.post<Adicional>(this.API_URL, adicional);
  }

  // Actualizar adicional
  actualizarAdicional(id: number, adicional: Adicional): Observable<Adicional> {
    return this.http.put<Adicional>(`${this.API_URL}/${id}`, adicional);
  }

  // Eliminar adicional
  eliminarAdicional(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  // ============== MÉTODOS ESPECÍFICOS PARA PRODUCTOS Y ADICIONALES ==============
  
  // Obtener adicionales disponibles
  getAdicionalesDisponibles(): Observable<Adicional[]> {
    return this.http.get<Adicional[]>(`${this.API_URL}/disponibles`);
  }

  // Obtener adicionales sin asignar a productos
  getAdicionalesSinAsignar(): Observable<Adicional[]> {
    return this.http.get<Adicional[]>(`${this.API_URL}/sin-asignar`);
  }

  // Obtener adicionales por producto
  getAdicionalesPorProducto(productoId: number): Observable<Adicional[]> {
    return this.http.get<Adicional[]>(`${this.API_URL}/producto/${productoId}`);
  }

  // Obtener adicionales disponibles para un producto específico
  getAdicionalesDisponiblesParaProducto(productoId: number): Observable<Adicional[]> {
    return this.http.get<Adicional[]>(`${this.API_URL}/disponibles-para-producto/${productoId}`);
  }

  // ============== NUEVO: API categorizada ==============
  getAdicionalesPorCategoria(categoria: 'PROTEINA'|'VEGETAL'|'SALSA'|'QUESO'|'EXTRA'): Observable<Adicional[]> {
    return this.http.get<Adicional[]>(`${this.API_URL}/categoria/${categoria}`);
  }

  getAdicionalesCategorizados(): Observable<{ proteinas: Adicional[]; vegetales: Adicional[]; salsas: Adicional[]; quesos: Adicional[]; extras: Adicional[]; }> {
    return this.http.get<{ proteinas: Adicional[]; vegetales: Adicional[]; salsas: Adicional[]; quesos: Adicional[]; extras: Adicional[]; }>(`${this.API_URL}/categorizados`);
  }

  // Obtener todas las relaciones producto-adicional
  getProductoAdicionales(): Observable<ProductoAdicional[]> {
    return this.http.get<ProductoAdicional[]>(`${this.API_URL}/productoAdicionales`);
  }

  // Obtener relaciones producto-adicional por ID de producto
  getProductoAdicionalesByProductoId(productoId: number): Observable<ProductoAdicional[]> {
    return this.http.get<ProductoAdicional[]>(`${this.API_URL}/productoAdicionales/${productoId}`);
  }

  // Obtener relaciones producto-adicional por ID de adicional
  getProductoAdicionalesByAdicionalId(adicionalId: number): Observable<ProductoAdicional[]> {
    return this.http.get<ProductoAdicional[]>(`${this.API_URL}/productoAdicionales/by-adicional/${adicionalId}`);
  }

  // ============== MÉTODOS CRUD PARA RELACIONES PRODUCTO-ADICIONAL ==============
  
  // Crear nueva relación producto-adicional
  crearProductoAdicional(productoId: number, adicionalId: number): Observable<ProductoAdicional> {
    return this.http.post<ProductoAdicional>(`${this.API_URL}/productoAdicionales`, {
      productoId: productoId,
      adicionalId: adicionalId
    });
  }

  // Eliminar relación producto-adicional
  eliminarProductoAdicional(productoId: number, adicionalId: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/productoAdicionales/${productoId}/${adicionalId}`);
  }

  // ============== MÉTODOS DE COMPATIBILIDAD HACIA ATRÁS ==============
  // Estos métodos son para mantener funcionando los componentes existentes
  
  // Método síncrono que devuelve array vacío (temporal)
  getAdicionales(): Adicional[] {
    console.warn('getAdicionales() es un método deprecated. Use getAllAdicionales() Observable');
    return [];
  }

  // Método para guardar adicional (mapea a crearAdicional)
  saveAdicional(adicional: Adicional): void {
    console.warn('saveAdicional() es un método deprecated. Use crearAdicional() Observable');
    this.crearAdicional(adicional).subscribe({
      next: (result) => console.log('Adicional creado:', result),
      error: (error) => console.error('Error creando adicional:', error)
    });
  }

  // Método para actualizar adicional (síncrono, temporal)
  updateAdicional(id: number, adicional: Adicional): void {
    console.warn('updateAdicional() es un método deprecated. Use actualizarAdicional() Observable');
    this.actualizarAdicional(id, adicional).subscribe({
      next: (result) => console.log('Adicional actualizado:', result),
      error: (error) => console.error('Error actualizando adicional:', error)
    });
  }

  // Método para eliminar adicional (síncrono, temporal)
  deleteAdicional(id: number): void {
    console.warn('deleteAdicional() es un método deprecated. Use eliminarAdicional() Observable');
    this.eliminarAdicional(id).subscribe({
      next: (result) => console.log('Adicional eliminado:', result),
      error: (error) => console.error('Error eliminando adicional:', error)
    });
  }

  // Método para resetear datos (temporal, no hace nada)
  resetToInitialData(): void {
    console.warn('resetToInitialData() es un método deprecated sin implementación en API REST');
  }
}
