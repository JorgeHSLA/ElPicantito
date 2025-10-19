import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PedidoCompleto } from '../models/pedido-completo';

export interface AsignarRepartidorDTO {
  pedidoId: number;
  repartidorId: number;
}

export interface ActualizarEstadoPedidoDTO {
  pedidoId: number;
  nuevoEstado: string;
}

@Injectable({
  providedIn: 'root'
})
export class GestionPedidosService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:9998/api/pedidos';

  /**
   * Obtiene todos los pedidos
   */
  getAllPedidos(): Observable<PedidoCompleto[]> {
    return this.http.get<PedidoCompleto[]>(this.apiUrl);
  }

  /**
   * Obtiene pedidos por estado
   */
  getPedidosPorEstado(estado: string): Observable<PedidoCompleto[]> {
    return this.http.get<PedidoCompleto[]>(`${this.apiUrl}?estado=${estado}`);
  }

  /**
   * Actualiza el estado de un pedido
   */
  actualizarEstado(pedidoId: number, nuevoEstado: string): Observable<PedidoCompleto> {
    return this.http.patch<PedidoCompleto>(
      `${this.apiUrl}/${pedidoId}/estado`,
      { estado: nuevoEstado }
    );
  }

  /**
   * Asigna un repartidor a un pedido
   */
  asignarRepartidor(data: AsignarRepartidorDTO): Observable<PedidoCompleto> {
    return this.http.post<PedidoCompleto>(
      `${this.apiUrl}/asignar-repartidor`,
      data
    );
  }

  /**
   * Obtiene un pedido por ID
   */
  getPedidoById(id: number): Observable<PedidoCompleto> {
    return this.http.get<PedidoCompleto>(`${this.apiUrl}/${id}`);
  }
}
