import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminNavbarComponent } from '../../shared/admin-navbar/admin-navbar.component';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component';
import { Adicional } from '../../../models/adicional';
import { ProductoAdicional } from '../../../models/producto-adicional';
import { Producto } from '../../../models/producto';
import { AdicionalService } from '../../../services/tienda/adicional.service';
import { ProductoService } from '../../../services/tienda/producto.service';

@Component({
  selector: 'app-adicionales',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AdminNavbarComponent, AdminSidebarComponent],
  templateUrl: './adicionales.html',
  styleUrl: './adicionales.css'
})
export class AdicionalesComponent implements OnInit {
  adicionales = signal<Adicional[]>([]);
  productoAdicionales = signal<ProductoAdicional[]>([]);
  productos = signal<Producto[]>([]);
  nuevoAdicional = signal<Adicional>({
    nombre: '',
    descripcion: '',
    precioDeVenta: 0,
    disponible: true
  });
  
  selectedAdicionalId = signal<number | null>(null);
  productosAsociados = signal<ProductoAdicional[]>([]);
  
  successMessage = signal('');
  errorMessage = signal('');

  constructor(
    private adicionalService: AdicionalService,
    private productoService: ProductoService
  ) {}

  ngOnInit() {
    this.loadProductos();
    this.loadAdicionales();
    this.loadProductoAdicionales();
  }

  loadAdicionales() {
    this.adicionalService.getAllAdicionales().subscribe({
      next: (adicionales) => this.adicionales.set(adicionales),
      error: () => this.errorMessage.set('Error al cargar adicionales')
    });
  }

  saveAdicional() {
    let adicional = this.nuevoAdicional();
    if (adicional.precio && !adicional.precioDeVenta) {
      adicional = { ...adicional, precioDeVenta: adicional.precio };
    }
    this.adicionalService.crearAdicional(adicional).subscribe({
      next: () => {
        this.successMessage.set('Adicional guardado exitosamente');
        this.loadAdicionales();
        this.resetForm();
        this.closeModal();
      },
      error: () => this.errorMessage.set('Error al guardar el adicional')
    });
  }

  deleteAdicional(id: number) {
    if (confirm('¿Estás seguro de eliminar este adicional?')) {
      this.adicionalService.eliminarAdicional(id).subscribe({
        next: () => {
          this.successMessage.set('Adicional eliminado exitosamente');
          this.loadAdicionales();
        },
        error: () => this.errorMessage.set('Error al eliminar el adicional')
      });
    }
  }

  resetForm() {
    this.nuevoAdicional.set({
      nombre: '',
      descripcion: '',
      precioDeVenta: 0,
      disponible: true
    });
  }

  updateAdicionalField(field: keyof Adicional, value: any) {
    this.nuevoAdicional.update(adicional => ({
      ...adicional,
      [field]: value
    }));
  }

  private closeModal() {
    const modal = document.getElementById('nuevoAdicionalModal');
    const modalInstance = (window as any).bootstrap?.Modal?.getInstance(modal);
    if (modalInstance) {
      modalInstance.hide();
    }
  }

  loadProductos() {
    this.productoService.getAllProductos().subscribe({
      next: (productos) => {
        console.log('Productos cargados en adicionales:', productos); // Debug
        this.productos.set(productos);
      },
      error: (error) => {
        console.error('Error al cargar productos:', error); // Debug
        this.errorMessage.set('Error al cargar productos');
      }
    });
  }
  loadProductoAdicionales() {
    this.adicionalService.getProductoAdicionales().subscribe({
      next: (relaciones) => {
        console.log('Relaciones producto-adicional cargadas:', relaciones); // Debug
        this.productoAdicionales.set(relaciones);
      },
      error: (error) => {
        console.error('Error al cargar relaciones:', error); // Debug
        this.errorMessage.set('Error al cargar relaciones producto-adicional');
      }
    });
  }

  getProductosAsociadosAAdicional(adicionalId: number): ProductoAdicional[] {
    const asociados = this.productoAdicionales().filter(pa => pa.adicionalId === adicionalId);
    console.log(`Productos asociados al adicional ${adicionalId}:`, asociados); // Debug
    return asociados;
  }

  getNombreProducto(productoId: number): string {
    const producto = this.productos().find(p => p.id === productoId);
    if (producto) {
      return producto.nombre || `Producto ${productoId}`;
    }
    console.log('Producto no encontrado:', productoId, 'en lista:', this.productos()); // Debug
    return `Producto ID: ${productoId}`;
  }

  getNombreAdicionalSeleccionado(): string {
    if (!this.selectedAdicionalId()) return '';
    const adicional = this.adicionales().find(a => a.id === this.selectedAdicionalId());
    return adicional?.nombre || '';
  }

  mostrarProductosAsociados(adicionalId: number) {
    this.selectedAdicionalId.set(adicionalId);
    this.adicionalService.getProductoAdicionalesByAdicionalId(adicionalId).subscribe({
      next: (relaciones) => {
        this.productosAsociados.set(relaciones);
        const modal = document.getElementById('productosAsociadosModal');
        const modalInstance = new (window as any).bootstrap.Modal(modal);
        modalInstance.show();
      },
      error: () => this.errorMessage.set('Error al cargar productos asociados')
    });
  }

  private closeProductosModal() {
    const modal = document.getElementById('productosAsociadosModal');
    const modalInstance = (window as any).bootstrap?.Modal?.getInstance(modal);
    if (modalInstance) {
      modalInstance.hide();
    }
  }
}
