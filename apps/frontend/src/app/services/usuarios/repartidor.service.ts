import { Injectable } from '@angular/core';
import { Repartidor } from '../../models/repartidor';

@Injectable({
  providedIn: 'root'
})
export class RepartidorService {
  
  private repartidores: Repartidor[] = [ 
  {
    id: 7,
    nombreCompleto: "Pedro Sánchez",
    nombreUsuario: "pedros",
    telefono: "3211112233",
    correo: "pedros@example.com",
    contrasenia: "reparto123",
    estado: "DISPONIBLE",
    pedidosRepartidor: []
  },
  {
    id: 8,
    nombreCompleto: "Laura Fernández",
    nombreUsuario: "lauraf",
    telefono: "3105556677",
    correo: "lauraf@example.com",
    contrasenia: "delivery456",
    estado: "OCUPADO",
    pedidosRepartidor: []
  }
  ]
  getRepartidores() {
      return this.repartidores
    }
}
