import { Component, signal, effect, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductoService } from '../../../services/tienda/producto.service';
import { Producto } from '../../../models/producto';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './searchbar.html',
  styleUrls: ['./searchbar.css']
})
export class SearchbarComponent {
  @ViewChild('searchInput') searchInput!: ElementRef;
  
  searchQuery = signal('');
  searchResults = signal<Producto[]>([]);
  showResults = signal(false);
  isSearching = signal(false);
  allProductos: Producto[] = [];

  constructor(
    private productoService: ProductoService,
    private router: Router
  ) {
    // Cargar todos los productos activos al inicio
    this.loadProductos();

    // Effect para buscar cuando cambia el query
    effect(() => {
      const query = this.searchQuery();
      if (query.trim().length >= 2) {
        this.performSearch(query);
      } else {
        this.searchResults.set([]);
        this.showResults.set(false);
      }
    });

    // Cerrar resultados al hacer click fuera
    if (typeof document !== 'undefined') {
      document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (!target.closest('.search-container')) {
          this.showResults.set(false);
        }
      });
    }
  }

  private loadProductos(): void {
    this.productoService.getProductosActivos().subscribe({
      next: (productos) => {
        this.allProductos = productos;
      },
      error: (error) => {
        console.error('Error cargando productos:', error);
      }
    });
  }

  private performSearch(query: string): void {
    this.isSearching.set(true);
    const searchTerm = query.toLowerCase().trim();
    
    const filtered = this.allProductos.filter(producto => 
      producto.categoria !== 'PERSONALIZADO' && (
        producto.nombre?.toLowerCase().includes(searchTerm) ||
        producto.descripcion?.toLowerCase().includes(searchTerm) ||
        producto.categoria?.toLowerCase().includes(searchTerm)
      )
    );

    this.searchResults.set(filtered);
    this.showResults.set(filtered.length > 0);
    this.isSearching.set(false);
  }

  onInputChange(value: string): void {
    this.searchQuery.set(value);
  }

  onSearch(): void {
    const query = this.searchQuery().trim();
    if (query) {
      // Navegar a la tienda con el término de búsqueda
      this.router.navigate(['/tienda'], { queryParams: { search: query } });
      this.showResults.set(false);
      this.searchQuery.set('');
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    } else if (event.key === 'Escape') {
      this.showResults.set(false);
      this.searchInput?.nativeElement.blur();
    }
  }

  selectProduct(producto: Producto): void {
    if (producto.id) {
      this.router.navigate(['/tienda'], { 
        queryParams: { productId: producto.id } 
      });
      this.showResults.set(false);
      this.searchQuery.set('');
    }
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.searchResults.set([]);
    this.showResults.set(false);
  }

  getProductImage(producto: Producto): string {
    return producto.imagen || '/images/placeholder-product.png';
  }

  getProductPrice(producto: Producto): number {
    return producto.precioDeVenta || producto.precio || 0;
  }
}