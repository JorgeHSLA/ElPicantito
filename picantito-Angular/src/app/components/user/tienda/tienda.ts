import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';
import { ProductoService } from '../../../services/tienda/producto.service';
import { Producto } from '../../../models/producto';

declare var bootstrap: any;

@Component({
  selector: 'app-tienda',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './tienda.html',
  styleUrls: ['./tienda.css']
})
export class TiendaComponent implements OnInit, AfterViewInit {

  // Datos de productos de la API
  productos: Producto[] = [];

  // Filtros
  categoriaSeleccionada: string = 'Todos';
  categorias = ['Todos', 'Disponibles', 'No Disponibles'];

  // Productos filtrados
  productosFiltrados: Producto[] = [];
  isLoading = true;
  error: string | null = null;

  // Estado del usuario (simulado por ahora)
  loggedUser: any = null; // Aquí integrarás con tu servicio de autenticación

  constructor(private productoService: ProductoService, private router: Router) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  private cargarProductos(): void {
    this.isLoading = true;
    this.error = null;

    this.productoService.getProductosActivos().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.filtrarProductos();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando productos:', error);
        this.error = 'Error al cargar los productos. Intenta de nuevo.';
        this.isLoading = false;
      }
    });
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
    } else if (this.categoriaSeleccionada === 'Disponibles') {
      this.productosFiltrados = this.productos.filter(producto =>
        producto.disponible === true
      );
    } else if (this.categoriaSeleccionada === 'No Disponibles') {
      this.productosFiltrados = this.productos.filter(producto =>
        producto.disponible === false
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
    // Navegar al constructor de tacos personalizado
    this.router.navigate(['/crear-taco']).then(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    });
  }
}
