import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductoService } from '../../../services/tienda/producto.service';
import { AdicionalService } from '../../../services/tienda/adicional.service';
import { CarritoService } from '../../../services/carrito.service';
import { AuthService } from '../../../services/auth.service';
import { Producto } from '../../../models/producto';
import { Adicional } from '../../../models/adicional';
import { ProductoAdicional } from '../../../models/producto-adicional';
import { AdicionalSeleccionado } from '../../../models/cart-item';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
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

  // Control de adicionales seleccionados
  adicionalesSeleccionados: Map<number, number> = new Map(); // adicionalId -> cantidad

  // Signals para el manejo de estados
  isAdding = signal(false);
  showLoginMessage = signal(false);
  private pendingAddToCart = false; // Flag para saber si debe agregar al carrito automáticamente

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productoService: ProductoService,
    private adicionalService: AdicionalService,
    private carritoService: CarritoService, // Nuevo servicio
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Obtener el ID del producto desde la URL
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarProducto(+id);
      
      // Verificar si hay una compra pendiente después del login
      this.verificarCompraPendiente();
    } else {
      this.error = 'ID de producto no válido';
      this.isLoading = false;
    }
  }

  /**
   * Verifica si hay una compra pendiente y la procesa
   */
  private verificarCompraPendiente(): void {
    const compraPendiente = localStorage.getItem('compraPendiente');
    if (compraPendiente && this.authService.isLoggedIn()) {
      try {
        const datos = JSON.parse(compraPendiente);
        const currentProductId = this.route.snapshot.paramMap.get('id');
        
        // Verificar que sea el mismo producto
        if (datos.productoId === Number(currentProductId)) {
          console.log('✅ Compra pendiente detectada, agregando al carrito automáticamente...');
          this.pendingAddToCart = true;
          
          // Restaurar cantidad y adicionales si existen
          if (datos.cantidad) {
            this.cantidad = datos.cantidad;
          }
          if (datos.adicionalesSeleccionados) {
            this.adicionalesSeleccionados = new Map(datos.adicionalesSeleccionados);
          }
          
          // Esperar a que el producto se cargue y luego agregar al carrito
          setTimeout(() => {
            if (this.producto) {
              this.procesarCompraPendiente();
            }
          }, 1000);
        }
        
        // Limpiar la compra pendiente
        localStorage.removeItem('compraPendiente');
      } catch (error) {
        console.error('Error procesando compra pendiente:', error);
        localStorage.removeItem('compraPendiente');
      }
    }
  }

  /**
   * Procesa la compra pendiente agregando el producto al carrito
   */
  private procesarCompraPendiente(): void {
    if (!this.producto || !this.authService.isLoggedIn()) {
      return;
    }

    console.log('🛒 Agregando producto al carrito automáticamente...');
    
    // Preparar adicionales seleccionados
    const adicionalesParaCarrito: AdicionalSeleccionado[] = [];
    this.adicionalesSeleccionados.forEach((cantidad, adicionalId) => {
      const adicional = this.adicionales.find(a => a.id === adicionalId);
      if (adicional && cantidad > 0) {
        const precioAdicional = adicional.precioDeVenta || adicional.precio || 0;
        adicionalesParaCarrito.push({
          adicional: adicional,
          cantidad: cantidad,
          subtotal: precioAdicional * cantidad
        });
      }
    });

    // Agregar al carrito
    this.carritoService.agregarItemConAdicionales(
      this.producto,
      this.cantidad,
      adicionalesParaCarrito
    );

    // Mostrar el carrito
    this.carritoService.showCart();
    
    console.log('✅ Producto agregado automáticamente al carrito');
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
    // Cargar productos relacionados de la BD (solo tacos, excluyendo el actual y el taco personalizado)
    this.productoService.getProductosActivos().subscribe({
      next: (productos) => {
        this.productosRelacionados = productos
          .filter(p => {
            // Excluir el producto actual
            if (p.id === this.producto?.id) return false;

            const nombreLower = (p.nombre || '').toLowerCase();

            // Excluir el taco personalizado
            if (nombreLower.includes('personalizado') ||
                nombreLower.includes('custom') ||
                nombreLower === 'crea tu taco') {
              return false;
            }

            // Solo incluir productos que tengan "taco" en el nombre
            if (!nombreLower.includes('taco')) {
              return false;
            }

            return true;
          })
          .slice(0, 5); // Mostrar máximo 5 tacos relacionados
      },
      error: (error) => {
        console.error('Error cargando productos relacionados:', error);
        this.productosRelacionados = [];
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

  // ==================== MÉTODOS PARA MANEJO DE ADICIONALES ====================

  // Agregar/quitar adicional
  toggleAdicional(adicional: Adicional): void {
    const cantidad = this.adicionalesSeleccionados.get(adicional.id!) || 0;
    if (cantidad > 0) {
      this.adicionalesSeleccionados.delete(adicional.id!);
    } else {
      this.adicionalesSeleccionados.set(adicional.id!, 1);
    }
  }

  // Actualizar cantidad de adicional
  actualizarCantidadAdicional(adicionalId: number, cantidad: number): void {
    if (cantidad <= 0) {
      this.adicionalesSeleccionados.delete(adicionalId);
    } else {
      this.adicionalesSeleccionados.set(adicionalId, cantidad);
    }
  }

  // Obtener cantidad de adicional seleccionado
  getCantidadAdicional(adicionalId: number): number {
    return this.adicionalesSeleccionados.get(adicionalId) || 0;
  }

  // Verificar si un adicional está seleccionado
  isAdicionalSeleccionado(adicionalId: number): boolean {
    return this.adicionalesSeleccionados.has(adicionalId);
  }

  // Calcular precio total con adicionales
  calcularPrecioTotal(): number {
    const precioBase = (this.producto?.precioDeVenta || this.producto?.precio || 0) * this.cantidad;

    let precioAdicionales = 0;
    this.adicionalesSeleccionados.forEach((cantidadAdicional, adicionalId) => {
      const adicional = this.adicionales.find(a => a.id === adicionalId);
      if (adicional) {
        const precioAdicional = adicional.precioDeVenta || adicional.precio || 0;
        precioAdicionales += precioAdicional * cantidadAdicional * this.cantidad;
      }
    });

    return precioBase + precioAdicionales;
  }

  // ==================== MÉTODO PRINCIPAL PARA AGREGAR AL CARRITO ====================

  // Método para agregar al carrito (NUEVO SISTEMA con adicionales)
  agregarAlCarrito(): void {
    if (this.producto && this.producto.disponible) {
      this.isAdding.set(true);

      // Verificar si el usuario está autenticado
      if (!this.authService.isLoggedIn()) {
        console.log('❌ Usuario no autenticado, mostrando modal de login...');
        this.isAdding.set(false);
        this.showLoginMessage.set(true);
        return;
      }

      // Preparar adicionales seleccionados para el nuevo sistema
      const adicionalesParaCarrito: AdicionalSeleccionado[] = [];
      this.adicionalesSeleccionados.forEach((cantidad, adicionalId) => {
        const adicional = this.adicionales.find(a => a.id === adicionalId);
        if (adicional && cantidad > 0) {
          const precioAdicional = adicional.precioDeVenta || adicional.precio || 0;
          adicionalesParaCarrito.push({
            adicional: adicional,
            cantidad: cantidad,
            subtotal: precioAdicional * cantidad
          });
        }
      });

      // USAR SIEMPRE EL NUEVO SISTEMA (CarritoService)
      this.carritoService.agregarItemConAdicionales(
        this.producto,
        this.cantidad,
        adicionalesParaCarrito
      );

      if (adicionalesParaCarrito.length > 0) {
        console.log(`Agregando ${this.cantidad} unidades de ${this.producto.nombre} con ${adicionalesParaCarrito.length} adicionales al carrito`);
      } else {
        console.log(`Agregando ${this.cantidad} unidades de ${this.producto.nombre} al carrito (sin adicionales)`);
      }

      // Mostrar feedback visual por un momento
      setTimeout(() => {
        this.isAdding.set(false);
      }, 1000);

      // Abrir el carrito para mostrar el producto agregado
      this.carritoService.showCart();

      // Limpiar selección de adicionales para próxima compra
      this.limpiarSeleccionAdicionales();
    }
  }

  // Limpiar selección de adicionales
  limpiarSeleccionAdicionales(): void {
    this.adicionalesSeleccionados.clear();
  }

  // Método para ir al login con returnUrl
  goToLogin(): void {
    this.showLoginMessage.set(false);
    
    // Guardar la intención de compra en localStorage
    if (this.producto) {
      const compraPendiente = {
        productoId: this.producto.id,
        cantidad: this.cantidad,
        adicionalesSeleccionados: Array.from(this.adicionalesSeleccionados.entries())
      };
      localStorage.setItem('compraPendiente', JSON.stringify(compraPendiente));
      console.log('💾 Intención de compra guardada:', compraPendiente);
    }
    
    const currentUrl = this.router.url; // Captura la URL actual (ej: /producto/5)
    console.log('🔄 Navegando a /login con returnUrl:', currentUrl);
    this.router.navigate(['/login'], { 
      queryParams: { returnUrl: currentUrl }
    });
  }

  // Método para cerrar el modal de login
  cerrarModalLogin(): void {
    this.showLoginMessage.set(false);
  }

  // Método para volver a la tienda
  volverATienda(): void {
    this.router.navigate(['/tienda']);
  }

  // Método para navegar a un producto relacionado
  verProductoRelacionado(id: number | undefined): void {
    if (id) {
      // Reiniciar el estado antes de navegar
      this.isLoading = true;
      this.producto = null;
      this.productosRelacionados = [];
      this.adicionales = [];
      this.limpiarSeleccionAdicionales();
      this.cantidad = 1;

      // Navegar al nuevo producto
      this.router.navigate(['/producto', id]).then(() => {
        // Scroll al inicio
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Cargar el nuevo producto
        this.cargarProducto(id);
      });
    }
  }

  // Métodos helper para las estrellas
  getStarsArray(rating: number | undefined): number[] {
    return Array.from({ length: rating || 0 }, (_, i) => i);
  }

  getEmptyStarsArray(rating: number | undefined): number[] {
    return Array.from({ length: 5 - (rating || 0) }, (_, i) => i);
  }
}
