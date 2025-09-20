import { Injectable } from '@angular/core';
import { Adicional } from '../../models/adicional';

@Injectable({
  providedIn: 'root'
})
export class AdicionalService {
  private adicionales: Adicional[] = [
  {
    id: 1,
    nombre: "Salsa BBQ",
    descripcion: "Porción extra de salsa barbacoa",
    precio: 3000,
    precioDeAdquisicion: 1500,
    cantidad: 50,
    disponible: true
  },
  {
    id: 2,
    nombre: "Queso Extra",
    descripcion: "Adición de queso mozzarella",
    precio: 5000,
    precioDeAdquisicion: 2500,
    cantidad: 30,
    disponible: true
  },
  {
    id: 3,
    nombre: "Papas a la Francesa",
    descripcion: "Porción mediana de papas fritas",
    precio: 8000,
    precioDeAdquisicion: 4000,
    cantidad: 20,
    disponible: false
  },
  {
    id: 4,
    nombre: "Bebida Gaseosa",
    descripcion: "Botella de 400 ml",
    precio: 6000,
    precioDeAdquisicion: 3000,
    cantidad: 40,
    disponible: true
  }
]

}
