import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private readonly API_URL = 'http://localhost:9998/api/pedidos';

  constructor(private http: HttpClient) {}

  getByCliente(clienteId: number): Observable<PedidoDto[]> {
    return this.http.get<PedidoDto[]>(`${this.API_URL}/cliente/${clienteId}`);
  }

  getByRepartidor(repartidorId: number): Observable<PedidoDto[]> {
    return this.http.get<PedidoDto[]>(`${this.API_URL}/repartidor/${repartidorId}`);
  }
}
