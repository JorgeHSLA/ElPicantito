import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminNavbarComponent } from '../../shared/admin-navbar/admin-navbar.component';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component';

import { Adicional } from '../../../models/adicional';
import { Producto } from '../../../models/producto';
import { ProductoAdicional } from '../../../models/producto-adicional';
import { AdicionalService } from '../../../services/tienda/adicional.service';
import { ProductoService } from '../../../services/tienda/producto.service';

@Component({
  selector: 'app-edit-adicional',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AdminNavbarComponent, AdminSidebarComponent],
  templateUrl: './edit-adicional.html',
  styleUrl: './edit-adicional.css'
})
export class EditAdicionalComponent implements OnInit {
  adicional = signal<Adicional>({
    id: undefined,
    nombre: '',
    descripcion: '',
    precio: 0,
    disponible: true
  });

  productos = signal<Producto[]>([]);
  productosAsociados = signal<ProductoAdicional[]>([]);
  productosDisponibles = signal<Producto[]>([]);
  
  successMessage = signal('');
  errorMessage = signal('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adicionalService: AdicionalService,
    private productoService: ProductoService
  ) {}


  ngOnInit() {
    const id = +this.route.snapshot.params['id'];
    if (id) {
      this.loadProductos();
      this.loadAdicional(id);
      this.loadProductosAsociados(id);
    }
  }


  loadAdicional(id: number) {
    this.adicionalService.getAdicionalById(id).subscribe({
      next: (adicional) => {
        if (adicional) {
          this.adicional.set(adicional);
        } else {
          this.router.navigate(['/admin/adicionales']);
        }
      },
      error: () => this.router.navigate(['/admin/adicionales'])
    });
  }


  updateAdicional() {
    try {
      const adicionalActualizado = this.adicional();
      if (adicionalActualizado.id) {
        this.adicionalService.actualizarAdicional(adicionalActualizado.id, adicionalActualizado).subscribe({
          next: () => {
            this.successMessage.set('Adicional actualizado exitosamente');
            setTimeout(() => {
              this.router.navigate(['/admin/adicionales']);
            }, 1500);
          },
          error: (error) => {
            console.error('Error al actualizar adicional:', error);
            this.errorMessage.set('Error al actualizar adicional: ' + (error.error || error.message));
            this.clearMessages();
          }
        });
      }
    } catch (error) {
      console.error('Error al actualizar adicional:', error);
      this.errorMessage.set('Error inesperado al actualizar adicional');
      this.clearMessages();
    }
  }

  updateField(field: keyof Adicional, value: any) {
    this.adicional.update(adicional => ({
      ...adicional,
      [field]: value
    }));
  }

  loadProductos() {
    this.productoService.getAllProductos().subscribe({
      next: (productos) => {
        console.log('Productos cargados:', productos); // Debug
        this.productos.set(productos.filter(p => p.activo));
        this.updateProductosDisponibles();
      },
      error: (error) => {
        console.error('Error al cargar productos:', error); // Debug
        this.errorMessage.set('Error al cargar productos');
      }
    });
  }

  loadProductosAsociados(adicionalId: number) {
    this.adicionalService.getProductoAdicionalesByAdicionalId(adicionalId).subscribe({
      next: (relaciones) => {
        console.log('Productos asociados cargados:', relaciones); // Debug
        this.productosAsociados.set(relaciones);
        this.updateProductosDisponibles();
      },
      error: (error) => {
        console.error('Error al cargar productos asociados:', error); // Debug
        this.errorMessage.set('Error al cargar productos asociados');
      }
    });
  }

  updateProductosDisponibles() {
    const productosAsociadosIds = this.productosAsociados().map(pa => pa.productoId);
    const disponibles = this.productos().filter(p => !productosAsociadosIds.includes(p.id));
    this.productosDisponibles.set(disponibles);
  }

  getNombreProducto(productoId: number): string {
    console.log('Buscando producto con ID:', productoId, 'en lista:', this.productos()); // Debug
    const producto = this.productos().find(p => p.id === productoId);
    if (producto) {
      return producto.nombre || `Producto ${productoId}`;
    }
    if (this.productos().length === 0) {
      this.loadProductos();
    }
    return `Producto ID: ${productoId}`;
  }

  asociarProducto(productoId: number) {
    console.log('Asociando producto:', productoId);
    const adicionalId = this.adicional().id;
    console.log('Adicional ID:', adicionalId);
    
    if (!adicionalId) {
      console.error('No hay ID de adicional');
      this.errorMessage.set('Debe guardar el adicional primero');
      this.clearMessages();
      return;
    }

    console.log('Enviando petición de asociación...');
    this.adicionalService.crearProductoAdicional(productoId, adicionalId).subscribe({
      next: (nuevaRelacion) => {
        console.log('Producto asociado exitosamente:', nuevaRelacion);
        this.successMessage.set('Producto asociado exitosamente');
        this.loadProductosAsociados(adicionalId);
        this.clearMessages();
      },
      error: (error) => {
        console.error('Error al asociar producto:', error);
        const mensaje = error.error?.message || error.error || error.message || 'Error desconocido';
        this.errorMessage.set('Error al asociar producto: ' + mensaje);
        this.clearMessages();
      }
    });
  }

  desasociarProducto(productoId: number) {
    console.log('Desasociando producto:', productoId); 
    const adicionalId = this.adicional().id;
    console.log('Adicional ID:', adicionalId); 
    
    if (!adicionalId) {
      console.error('No hay ID de adicional'); 
      return;
    }

    const nombreProducto = this.getNombreProducto(productoId);
    console.log('Nombre del producto a desasociar:', nombreProducto);
    
    if (confirm(`¿Estás seguro de desasociar "${nombreProducto}"?`)) {
      console.log('Confirmado, enviando petición de desasociación...'); 
      this.adicionalService.eliminarProductoAdicional(productoId, adicionalId).subscribe({
        next: (response) => {
          console.log('Producto desasociado exitosamente:', response); 
          this.successMessage.set('Producto desasociado exitosamente');
          this.loadProductosAsociados(adicionalId);
          this.clearMessages();
        },
        error: (error) => {
          console.error('Error al desasociar producto:', error);
          const mensaje = error.error?.message || error.error || error.message || 'Error desconocido';
          this.errorMessage.set('Error al desasociar producto: ' + mensaje);
          this.clearMessages();
        }
      });
    } else {
      console.log('Desasociación cancelada por el usuario');
    }
  }

  refreshProductosData() {
    const adicionalId = this.adicional().id;
    if (!adicionalId) return;
    
    this.productoService.getAllProductos().subscribe({
      next: (productos) => {
        this.productos.set(productos.filter(p => p.activo));
        this.loadProductosAsociados(adicionalId);
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.errorMessage.set('Error al refrescar productos');
        this.clearMessages();
      }
    });
  }

  private clearMessages() {
    setTimeout(() => {
      this.successMessage.set('');
      this.errorMessage.set('');
    }, 3000);
  }
}
