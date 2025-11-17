import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
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

  constructor(
    private productoService: ProductoService,
    private router: Router,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  ngAfterViewInit(): void {
    // Inicializar componentes Bootstrap
    this.initializeBootstrapComponents();

    // Esperar a que los productos se carguen antes de inicializar animaciones
    setTimeout(() => {
      this.setupScrollAnimations();
    }, 100);
  }

  private initializeBootstrapComponents(): void {
    // Inicializar tooltips
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(tooltipTriggerEl => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  private setupScrollAnimations(): void {
    const revealElements = this.elementRef.nativeElement.querySelectorAll('.scroll-reveal');

    if (revealElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry: IntersectionObserverEntry, index: number) => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          const animation = element.dataset['animation'] || 'animate__fadeInUp';

          // Añadir animación más rápida
          setTimeout(() => {
            element.style.opacity = '1';
            element.classList.add('animate__animated', animation, 'animate__faster');
          }, index * 30); // Delay más corto entre elementos

          observer.unobserve(element);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px'
    });

    revealElements.forEach((element: Element) => {
      observer.observe(element);
    });
  }

  private cargarProductos(): void {
    this.isLoading = true;
    this.error = null;

    this.productoService.getProductosActivos().subscribe({
      next: (productos) => {
        console.log('Productos cargados desde API:', productos); // Debug
        // Simplemente asignar todos los productos sin filtrar
        this.productos = productos;
        console.log('Total productos asignados:', this.productos.length); // Debug
        this.filtrarProductos();
        console.log('Productos filtrados:', this.productosFiltrados.length); // Debug
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando productos:', error);
        this.error = 'Error al cargar los productos. Intenta de nuevo.';
        this.isLoading = false;
      }
    });
  }

  // Métodos de filtrado
  filtrarPorCategoria(categoria: string): void {
    this.categoriaSeleccionada = categoria;
    this.filtrarProductos();
  }

  private filtrarProductos(): void {
    console.log('Filtrando por categoría:', this.categoriaSeleccionada);
    console.log('Productos base:', this.productos);

    if (this.categoriaSeleccionada === 'Todos') {
      this.productosFiltrados = [...this.productos];
    } else if (this.categoriaSeleccionada === 'Disponibles') {
      this.productosFiltrados = this.productos.filter(producto =>
        producto.disponible === true || (producto.disponible as any) === 1
      );
    } else if (this.categoriaSeleccionada === 'No Disponibles') {
      this.productosFiltrados = this.productos.filter(producto =>
        producto.disponible === false || (producto.disponible as any) === 0
      );
    } else {
      this.productosFiltrados = [...this.productos];
    }

    console.log('Productos filtrados resultado:', this.productosFiltrados);
  }

  // Métodos helper para las estrellas
  getStarsArray(rating: number): number[] {
    return Array.from({ length: rating }, (_, i) => i);
  }

  getEmptyStarsArray(rating: number): number[] {
    return Array.from({ length: 5 - rating }, (_, i) => i);
  }

  // Navegación y acciones
  navigateToProduct(productId: number): void {
    console.log('Navegando a producto:', productId);
    this.router.navigate(['/producto', productId]).then(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    });
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
