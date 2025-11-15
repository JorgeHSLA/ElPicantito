import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Estadisticas {
  ventasPorDia: { [fecha: string]: number };
  mejoresClientes: number[];
  productosMenosVendidos: number[];
  productosMasVendidos: number[];
  adicionalesMasConsumidos: number[];
  adicionalesMenosConsumidos: number[];
  productosNoRecomendados: number[];
  productosRecomendados: number[];
  ingresosTotales: number;
  ingresosNetos: number;
  totalPedidos: number;
}

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {
  private readonly API_URL = 'http://localhost:9998/api/estadisticas';

  constructor(private http: HttpClient) {}

  obtenerEstadisticas(): Observable<Estadisticas> {
    return this.http.get<Estadisticas>(`${this.API_URL}/todas`);
  }
}
