import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminNavbarComponent } from '../../shared/admin-navbar/admin-navbar.component';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component';
import { Adicional } from '../../../models/adicional';
import { Producto } from '../../../models/producto';
import { ProductoAdicional } from '../../../models/producto-adicional';
import { AdicionalService } from '../../../services/tienda/adicional.service';
import { ProductoService } from '../../../services/tienda/producto.service';

@Component({
  selector: 'app-producto-adicional',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AdminNavbarComponent, AdminSidebarComponent],
  templateUrl: './producto-adicional.html',
  styleUrl: './producto-adicional.css'
})
export class ProductoAdicionalComponent implements OnInit {
  productos = signal<Producto[]>([]);
  adicionales = signal<Adicional[]>([]);
  productoAdicionales = signal<ProductoAdicional[]>([]);
  
  // Para el formulario de asignación
  selectedProductoId = signal<number | null>(null);
  selectedAdicionalId = signal<number | null>(null);
  
  successMessage = signal('');
  errorMessage = signal('');

  constructor(
    private adicionalService: AdicionalService,
    private productoService: ProductoService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loadProductos();
    this.loadAdicionales();
    this.loadProductoAdicionales();
  }

  loadProductos() {
    this.productoService.getAllProductos().subscribe({
      next: (productos) => this.productos.set(productos.filter(p => p.activo)),
      error: () => this.errorMessage.set('Error al cargar productos')
    });
  }

  loadAdicionales() {
    this.adicionalService.getAdicionalesDisponibles().subscribe({
      next: (adicionales) => this.adicionales.set(adicionales),
      error: () => this.errorMessage.set('Error al cargar adicionales')
    });
  }

  loadProductoAdicionales() {
    this.adicionalService.getProductoAdicionales().subscribe({
      next: (relaciones) => this.productoAdicionales.set(relaciones),
      error: () => this.errorMessage.set('Error al cargar relaciones')
    });
  }

  // Obtener nombre del producto por ID
  getNombreProducto(productoId: number): string {
    const producto = this.productos().find(p => p.id === productoId);
    return producto?.nombre || 'Producto no encontrado';
  }

  // Obtener nombre del adicional por ID
  getNombreAdicional(adicionalId: number): string {
    const adicional = this.adicionales().find(a => a.id === adicionalId);
    return adicional?.nombre || 'Adicional no encontrado';
  }

  // Verificar si un producto ya tiene un adicional asignado
  productoTieneAdicional(productoId: number, adicionalId: number): boolean {
    return this.productoAdicionales().some(pa => 
      pa.productoId === productoId && pa.adicionalId === adicionalId
    );
  }

  // Obtener adicionales de un producto
  getAdicionalesDeProducto(productoId: number): ProductoAdicional[] {
    return this.productoAdicionales().filter(pa => pa.productoId === productoId);
  }

  // Obtener productos de un adicional
  getProductosDeAdicional(adicionalId: number): ProductoAdicional[] {
    return this.productoAdicionales().filter(pa => pa.adicionalId === adicionalId);
  }

  // Crear nueva relación producto-adicional
  crearRelacion() {
    const productoId = this.selectedProductoId();
    const adicionalId = this.selectedAdicionalId();

    if (!productoId || !adicionalId) {
      this.errorMessage.set('Debe seleccionar un producto y un adicional');
      return;
    }

    if (this.productoTieneAdicional(productoId, adicionalId)) {
      this.errorMessage.set('Esta relación ya existe');
      return;
    }

    this.adicionalService.crearProductoAdicional(productoId, adicionalId).subscribe({
      next: (nuevaRelacion) => {
        this.successMessage.set('Relación creada exitosamente');
        this.loadProductoAdicionales();
        this.resetForm();
        this.closeModal();
      },
      error: (error) => {
        this.errorMessage.set('Error al crear la relación: ' + (error.error || error.message));
      }
    });
  }

  // Eliminar relación producto-adicional
  eliminarRelacion(productoId: number, adicionalId: number) {
    if (confirm('¿Estás seguro de eliminar esta relación?')) {
      this.adicionalService.eliminarProductoAdicional(productoId, adicionalId).subscribe({
        next: () => {
          this.successMessage.set('Relación eliminada exitosamente');
          this.loadProductoAdicionales();
        },
        error: (error) => {
          this.errorMessage.set('Error al eliminar la relación: ' + (error.error || error.message));
        }
      });
    }
  }

  // Resetear formulario
  resetForm() {
    this.selectedProductoId.set(null);
    this.selectedAdicionalId.set(null);
  }

  // Cerrar modal
  private closeModal() {
    const modal = document.getElementById('crearRelacionModal');
    const modalInstance = (window as any).bootstrap?.Modal?.getInstance(modal);
    if (modalInstance) {
      modalInstance.hide();
    }
  }
}