import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-tienda',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tienda.html',
  styleUrls: ['./tienda.css']
})
export class TiendaComponent implements OnInit, AfterViewInit {
  
  // Datos de productos (simulados)
  productos = [
    {
      id: 1,
      nombre: 'Taco al Pastor',
      descripcion: 'Taco tradicional de cerdo adobado con piña, cebolla y cilantro en tortilla de maíz.',
      precio: 1.40,
      imagen: 'https://lastaquerias.com/wp-content/uploads/2022/11/tacos-pastor-gaacc26fa8_1920.jpg',
      disponible: true,
      calificacion: 5,
      categoria: 'Tacos'
    },
    {
      id: 2,
      nombre: 'Taco de Carne Asada',
      descripcion: 'Carne de res asada a la parrilla con guacamole, cebolla y cilantro.',
      precio: 1.55,
      imagen: 'https://www.eatingonadime.com/wp-content/uploads/2024/03/carne-asada-1-square-1.jpg',
      disponible: true,
      calificacion: 5,
      categoria: 'Tacos'
    },
    {
      id: 3,
      nombre: 'Taco de Suadero',
      descripcion: 'Suaves trozos de suadero fritos en su jugo, servidos con salsa verde.',
      precio: 1.50,
      imagen: 'https://images.squarespace-cdn.com/content/v1/5a95f6d54611a0f9ec0a7f5e/1568912331542-701S75SMDWD3VQZI72OA/tacos-rey-del-suadero.jpg',
      disponible: true,
      calificacion: 5,
      categoria: 'Tacos'
    },
    {
      id: 4,
      nombre: 'Taco de Carnitas',
      descripcion: 'Cerdo cocido lentamente, servido con cebolla y cilantro.',
      precio: 1.40,
      imagen: 'https://okdiario.com/img/2022/04/30/tacos.jpg',
      disponible: true,
      calificacion: 5,
      categoria: 'Tacos'
    },
    {
      id: 5,
      nombre: 'Taco de Barbacoa',
      descripcion: 'Taco de barbacoa de borrego con salsa borracha.',
      precio: 1.70,
      imagen: 'https://images.squarespace-cdn.com/content/v1/56801b350e4c11744888ec37/1460472452918-SE8BPNUWMWCKTOPP1CHF/Lamb+Barbacoa+Tacos.jpg?format=1500w',
      disponible: true,
      calificacion: 5,
      categoria: 'Tacos'
    },
    {
      id: 6,
      nombre: 'Taco de Birria',
      descripcion: 'Taco de birria de res acompañado de consomé.',
      precio: 1.80,
      imagen: 'https://happyvegannie.com/wp-content/uploads/2023/09/birriatacos-1200x1200-2.jpg',
      disponible: true,
      calificacion: 5,
      categoria: 'Tacos'
    }
  ];

  // Filtros
  categoriaSeleccionada: string = 'Todos';
  categorias = ['Todos', 'Tacos', 'Bebidas', 'Extras', 'Especiales'];
  
  // Productos filtrados
  productosFiltrados = [...this.productos];

  // Estado del usuario (simulado por ahora)
  loggedUser: any = null; // Aquí integrarás con tu servicio de autenticación

  constructor() {}

  ngOnInit(): void {
    this.filtrarProductos();
  }

  ngAfterViewInit(): void {
    this.initializeBootstrapComponents();
  }

  private initializeBootstrapComponents(): void {
    // Inicializar tooltips
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(tooltipTriggerEl => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  // Métodos de filtrado
  filtrarPorCategoria(categoria: string): void {
    this.categoriaSeleccionada = categoria;
    this.filtrarProductos();
  }

  private filtrarProductos(): void {
    if (this.categoriaSeleccionada === 'Todos') {
      this.productosFiltrados = [...this.productos];
    } else {
      this.productosFiltrados = this.productos.filter(producto => 
        producto.categoria === this.categoriaSeleccionada
      );
    }
  }

  // Métodos helper para las estrellas
  getStarsArray(rating: number): number[] {
    return Array(rating).fill(0);
  }

  getEmptyStarsArray(rating: number): number[] {
    return Array(5 - rating).fill(0);
  }

  // Navegación y acciones
  navigateToProduct(productId: number): void {
    console.log('Navegando a producto:', productId);
  }

  agregarAlCarrito(producto: any): void {
    console.log('Agregando al carrito:', producto);
    // Aquí implementarás la lógica del carrito
  }

  crearTacoPersonalizado(): void {
    console.log('Crear taco personalizado');
    // Implementar navegación a creador de tacos
  }
}
