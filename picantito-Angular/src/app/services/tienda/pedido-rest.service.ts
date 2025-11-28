import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PedidoCompleto, CrearPedidoRequest } from '../../models/pedido-completo';
import { environment } from '../../../environments/environment';

export interface PedidoDto {
  id: number;
  precio?: number;
  precioDeVenta?: number;
  fechaEntrega?: string;
  fechaSolicitud?: string;
  estado?: string;
  direccion?: string;
  cliente?: { id: number; nombreUsuario?: string; nombreCompleto?: string } | number;
}

@Injectable({ providedIn: 'root' })
export class PedidoRestService {
  private readonly API_URL = `${environment.apiUrl}/api/pedidos`;

  constructor(private http: HttpClient) {}

  // ==================== MÉTODOS BÁSICOS ====================
  
  /**
   * Obtener todos los pedidos
   */
  getAllPedidos(): Observable<PedidoCompleto[]> {
    return this.http.get<PedidoCompleto[]>(this.API_URL);
  }

  /**
   * Obtener pedido por ID
   */
  getPedidoById(id: number): Observable<PedidoCompleto> {
    return this.http.get<PedidoCompleto>(`${this.API_URL}/${id}`);
  }

  /**
   * Crear nuevo pedido
   */
  crearPedido(pedidoData: CrearPedidoRequest): Observable<PedidoCompleto> {
    return this.http.post<PedidoCompleto>(this.API_URL, pedidoData);
  }

  /**
   * Actualizar pedido
   */
  actualizarPedido(id: number, pedidoData: Partial<CrearPedidoRequest>): Observable<PedidoCompleto> {
    return this.http.put<PedidoCompleto>(`${this.API_URL}/${id}`, pedidoData);
  }

  /**
   * Eliminar pedido
   */
  eliminarPedido(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  // ==================== MÉTODOS ESPECÍFICOS ====================

  getByCliente(clienteId: number): Observable<PedidoDto[]> {
    return this.http.get<PedidoDto[]>(`${this.API_URL}/cliente/${clienteId}`);
  }

  getByRepartidor(repartidorId: number): Observable<PedidoDto[]> {
    return this.http.get<PedidoDto[]>(`${this.API_URL}/repartidor/${repartidorId}`);
  }

  /**
   * Obtener pedidos por estado
   */
  getPedidosByEstado(estado: string): Observable<PedidoCompleto[]> {
    return this.http.get<PedidoCompleto[]>(`${this.API_URL}/estado/${estado}`);
  }

  /**
   * Cambiar estado del pedido
   */
  cambiarEstadoPedido(id: number, nuevoEstado: string): Observable<PedidoCompleto> {
    return this.http.patch<PedidoCompleto>(`${this.API_URL}/${id}/estado`, { estado: nuevoEstado });
  }

  /**
   * Asignar repartidor a pedido
   */
  asignarRepartidor(pedidoId: number, repartidorId: number): Observable<PedidoCompleto> {
    return this.http.patch<PedidoCompleto>(`${this.API_URL}/${pedidoId}/repartidor`, { repartidorId });
  }
}
