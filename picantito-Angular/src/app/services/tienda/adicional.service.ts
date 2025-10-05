import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Adicional } from '../../models/adicional';

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
