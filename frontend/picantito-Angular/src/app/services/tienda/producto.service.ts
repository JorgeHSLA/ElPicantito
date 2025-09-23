import { Injectable } from '@angular/core';
import { Producto } from '../../models/producto';

@Injectable({
  providedIn: 'root'
})

export class ProductoService {
  
  private productos: Producto[] = [
  {
    id: 1,
    nombre: "Hamburguesa Clásica",
    descripcion: "Carne 100% res, pan artesanal, lechuga, tomate y queso cheddar.",
    precio: 18000,
    precioDeAdquisicion: 10000,
    imagen: "assets/img/hamburguesa_clasica.jpg",
    disponible: true,
    calificacion: 4
  },
  {
    id: 2,
    nombre: "Pizza Pepperoni",
    descripcion: "Pizza mediana con salsa napolitana, queso mozzarella y pepperoni.",
    precio: 25000,
    precioDeAdquisicion: 15000,
    imagen: "assets/img/pizza_pepperoni.jpg",
    disponible: true,
    calificacion: 5
  },
  {
    id: 3,
    nombre: "Perro Caliente",
    descripcion: "Pan suave, salchicha americana, papas ripio y salsas.",
    precio: 12000,
    precioDeAdquisicion: 7000,
    imagen: "assets/img/perro_caliente.jpg",
    disponible: false,
    calificacion: 3
  },
  {
    id: 4,
    nombre: "Ensalada César",
    descripcion: "Pollo a la plancha, lechuga romana, crutones y aderezo césar.",
    precio: 15000,
    precioDeAdquisicion: 8000,
    imagen: "assets/img/ensalada_cesar.jpg",
    disponible: true,
    calificacion: 4
  },
  {
    id: 5,
    nombre: "Tacos Mexicanos",
    descripcion: "Tortilla de maíz, carne al pastor, piña y guacamole.",
    precio: 20000,
    precioDeAdquisicion: 12000,
    imagen: "assets/img/tacos_mexicanos.jpg",
    disponible: true,
    calificacion: 5
  }
  ]

  getProductos() {
    return this.productos;
  }

}
