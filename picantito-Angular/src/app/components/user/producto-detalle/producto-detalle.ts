import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductoService } from '../../../services/tienda/producto.service';
import { AdicionalService } from '../../../services/tienda/adicional.service';
import { Producto } from '../../../models/producto';
import { Adicional } from '../../../models/adicional';
import { ProductoAdicional } from '../../../models/producto-adicional';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './producto-detalle.html',
  styleUrls: ['./producto-detalle.css']
})
export class ProductoDetalleComponent implements OnInit {
  producto: Producto | null = null;
  isLoading = true;
  error: string | null = null;
  cantidad: number = 1;

  // Productos relacionados (simulados por ahora)
  productosRelacionados: Producto[] = [];
  
  // Adicionales del producto
  adicionales: Adicional[] = [];
  adicionalesLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productoService: ProductoService,
    private adicionalService: AdicionalService
  ) {}

  ngOnInit(): void {
    // Obtener el ID del producto desde la URL
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarProducto(+id);
    } else {
      this.error = 'ID de producto no válido';
      this.isLoading = false;
    }
  }

  private cargarProducto(id: number): void {
    this.isLoading = true;
    this.error = null;

    this.productoService.getProductoById(id).subscribe({
      next: (producto) => {
        this.producto = producto;
        this.isLoading = false;
        this.cargarProductosRelacionados();
        this.cargarAdicionales(id);
      },
      error: (error) => {
        console.error('Error cargando producto:', error);
        this.error = 'No se pudo cargar el producto. Intenta de nuevo.';
        this.isLoading = false;
      }
    });
  }

  private cargarProductosRelacionados(): void {
    // Cargar algunos productos relacionados (excluyendo el actual)
    this.productoService.getProductosActivos().subscribe({
      next: (productos) => {
        this.productosRelacionados = productos
          .filter(p => p.id !== this.producto?.id)
          .slice(0, 3); // Solo mostrar 3 productos relacionados
      },
      error: (error) => {
        console.error('Error cargando productos relacionados:', error);
      }
    });
  }

  private cargarAdicionales(productoId: number): void {
    this.adicionalesLoading = true;
    
    // Obtener las relaciones producto-adicional para este producto
    this.adicionalService.getProductoAdicionalesByProductoId(productoId).subscribe({
      next: (relaciones: ProductoAdicional[]) => {
        // Para cada relación, obtener los datos completos del adicional
        const adicionalesIds = relaciones.map(rel => rel.adicionalId);
        
        if (adicionalesIds.length > 0) {
          this.adicionalService.getAllAdicionales().subscribe({
            next: (todosAdicionales: Adicional[]) => {
              this.adicionales = todosAdicionales.filter(adicional => 
                adicionalesIds.includes(adicional.id || 0) && adicional.disponible
              );
              this.adicionalesLoading = false;
            },
            error: () => {
              console.error('Error cargando adicionales');
              this.adicionales = [];
              this.adicionalesLoading = false;
            }
          });
        } else {
          this.adicionales = [];
          this.adicionalesLoading = false;
        }
      },
      error: () => {
        console.error('Error cargando relaciones producto-adicional');
        this.adicionales = [];
        this.adicionalesLoading = false;
      }
    });
  }

  // Métodos para manejar la cantidad
  incrementarCantidad(): void {
    if (this.cantidad < 99) {
      this.cantidad++;
    }
  }

  decrementarCantidad(): void {
    if (this.cantidad > 1) {
      this.cantidad--;
    }
  }

  // Método para obtener el precio total
  getPrecioTotal(): number {
    return (this.producto?.precioDeVenta || 0) * this.cantidad;
  }

  // Método para agregar al carrito
  agregarAlCarrito(): void {
    if (this.producto) {
      console.log(`Agregando ${this.cantidad} unidades de ${this.producto.nombre} al carrito`);
      // Aquí implementarás la lógica del carrito de compras
      // Por ejemplo: this.carritoService.agregarProducto(this.producto, this.cantidad);
      
      // Mostrar mensaje de confirmación (puedes usar un toast o modal)
      alert(`Se agregaron ${this.cantidad} unidades al carrito`);
    }
  }

  // Método para volver a la tienda
  volverATienda(): void {
    this.router.navigate(['/tienda']);
  }

  // Método para navegar a un producto relacionado
  verProductoRelacionado(id: number | undefined): void {
    if (id) {
      this.router.navigate(['/producto', id]).then(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  // Métodos helper para las estrellas
  getStarsArray(rating: number | undefined): number[] {
    return Array(rating || 0).fill(0);
  }

  getEmptyStarsArray(rating: number | undefined): number[] {
    return Array(5 - (rating || 0)).fill(0);
  }
}
