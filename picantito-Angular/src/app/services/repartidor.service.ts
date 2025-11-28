import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Repartidor } from '../models/repartidor';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RepartidorService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/usuarios`; // Endpoint base

  /**
   * Obtiene todos los repartidores
   */
  getRepartidores(): Observable<Repartidor[]> {
    return this.http.get<Repartidor[]>(`${this.apiUrl}?rol=REPARTIDOR`);
  }

  /**
   * Obtiene repartidores disponibles
   */
  getRepartidoresDisponibles(): Observable<Repartidor[]> {
    return this.http.get<Repartidor[]>(`${this.apiUrl}?rol=REPARTIDOR&estado=DISPONIBLE`);
  }

  /**
   * Obtiene repartidores ocupados
   */
  getRepartidoresOcupados(): Observable<Repartidor[]> {
    return this.http.get<Repartidor[]>(`${this.apiUrl}?rol=REPARTIDOR&estado=OCUPADO`);
  }

  /**
   * Obtiene un repartidor por ID
   */
  getRepartidorById(id: number): Observable<Repartidor> {
    return this.http.get<Repartidor>(`${this.apiUrl}/${id}`);
  }

  /**
   * Actualiza el estado de un repartidor
   */
  actualizarEstado(id: number, estado: string): Observable<Repartidor> {
    return this.http.patch<Repartidor>(`${this.apiUrl}/${id}/estado`, { estado });
  }

  /**
   * Cambia el estado del repartidor usando el endpoint del backend
   * PUT /api/usuarios/repartidor/{id}/estado/{estado}
   */
  cambiarEstadoRepartidor(id: number, estado: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/repartidor/${id}/estado/${encodeURIComponent(estado)}`, {});
  }

  /**
   * Obtiene los pedidos asignados a un repartidor
   */
  getPedidosRepartidor(repartidorId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:9998/api/pedidos/repartidor/${repartidorId}`);
  }
}
