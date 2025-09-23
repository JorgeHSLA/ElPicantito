import { Injectable } from '@angular/core';
import { Cliente } from '../../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  getClientes() {
    return this.clientes;
  }

  private clientes: Cliente[] = [ 
  {
    id: 3,
    nombreCompleto: "Carlos Gómez",
    nombreUsuario: "carlosg",
    telefono: "3001234567",
    correo: "carlosg@example.com",
    contrasenia: "clave123",
    pedidosCliente: []
  },
  {
    id: 4,
    nombreCompleto: "María Rodríguez",
    nombreUsuario: "mariar",
    telefono: "3109876543",
    correo: "mariar@example.com",
    contrasenia: "mypass456",
    pedidosCliente: []
  }
]

  
}
