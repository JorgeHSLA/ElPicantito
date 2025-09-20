import { Injectable } from '@angular/core';
import { Administrador } from '../../models/administrador';

@Injectable({
  providedIn: 'root'
})
export class AdministradorService {

  private administradores:Administrador[] = [ 
    {
      id : 1,
      nombreCompleto : "Juan Perez",
      nombreUsuario : "juanp",
      telefono : "1234567890",
      correo : "pBv0L@example.com", 
      contrasenia : "password123"

    },
    {
      id : 2,
      nombreCompleto : "ADMIN",
      nombreUsuario : "ADMIN",
      telefono : "1234567899",
      correo : "ADMIN@example.com", 
      contrasenia : "ADMIN"

    }


  ]


  
}
