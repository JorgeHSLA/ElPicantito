import { Injectable } from '@angular/core';
import { Operador } from '../../models/operador';

@Injectable({
  providedIn: 'root'
})
export class OperadorService {
  private operadores: Operador[] = [ 
  {
    id: 5,
    nombreCompleto: "Luis Martínez",
    nombreUsuario: "luism",
    telefono: "3201112233",
    correo: "luism@example.com",
    contrasenia: "operador123"
  },
  {
    id: 6,
    nombreCompleto: "Ana Torres",
    nombreUsuario: "anatorres",
    telefono: "3154445566",
    correo: "anatorres@example.com",
    contrasenia: "claveop456"
  }
]

}
