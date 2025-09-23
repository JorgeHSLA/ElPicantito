import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../../models/producto';

@Injectable({
  providedIn: 'root'
})

export class ProductoService {
  
  private apiUrl = '/api/productos';  // Ruta del backend
  
  private productos: Producto[] = [
  {
    id: 1,
    nombre: "Hamburguesa Clásica",
    descripcion: "Carne 100% res, pan artesanal, lechuga, tomate y queso cheddar.",
    precio: 18000,
    precioDeAdquisicion: 10000,
    imagen: "/images/taco1.webp",
    disponible: true,
    calificacion: 4
  },
  {
    id: 2,
    nombre: "Pizza Pepperoni",
    descripcion: "Pizza mediana con salsa napolitana, queso mozzarella y pepperoni.",
    precio: 25000,
    precioDeAdquisicion: 15000,
    imagen: "/images/taco2.webp",
    disponible: true,
    calificacion: 5
  },
  {
    id: 3,
    nombre: "Perro Caliente",
    descripcion: "Pan suave, salchicha americana, papas ripio y salsas.",
    precio: 12000,
    precioDeAdquisicion: 7000,
    imagen: "/images/taco3.webp",
    disponible: false,
    calificacion: 3
  },
  {
    id: 4,
    nombre: "Ensalada César",
    descripcion: "Pollo a la plancha, lechuga romana, crutones y aderezo césar.",
    precio: 15000,
    precioDeAdquisicion: 8000,
    imagen: "/images/taco1.webp",
    disponible: true,
    calificacion: 4
  },
  {
    id: 5,
    nombre: "Tacos Mexicanos",
    descripcion: "Tortilla de maíz, carne al pastor, piña y guacamole.",
    precio: 20000,
    precioDeAdquisicion: 12000,
    imagen: "/images/taco2.webp",
    disponible: true,
    calificacion: 5
  }
  ]

  constructor(private http: HttpClient) {}

  // Métodos para conectar con el backend
  getProductosFromAPI(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  getProductoById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  createProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto);
  }

  updateProducto(id: number, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, producto);
  }

  deleteProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Método temporal para datos de prueba (remover cuando el backend esté listo)
  getProductos() {
    return this.productos;
  }

}
