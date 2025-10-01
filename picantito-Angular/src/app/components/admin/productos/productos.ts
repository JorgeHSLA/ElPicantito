import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminNavbarComponent } from '../../shared/admin-navbar/admin-navbar.component';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component';
import { Producto } from '../../../models/producto';
import { ProductoService } from '../../../services/tienda/producto.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AdminNavbarComponent, AdminSidebarComponent],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class ProductosComponent implements OnInit {
  productos = signal<Producto[]>([]);
  nuevoProducto = signal<Producto>({
    nombre: '',
    descripcion: '',
    precio: 0,
    precioDeAdquisicion: 0,
    imagen: '',
    calificacion: 5,
    disponible: true
  });
  
  successMessage = signal('');
  errorMessage = signal('');

  constructor(private productoService: ProductoService) {}

  ngOnInit() {
    this.loadProductos();
  }

  loadProductos() {
    this.productos.set(this.productoService.getProductos());
  }

  saveProducto() {
    try {
      const producto = this.nuevoProducto();
      this.productoService.addProducto(producto);
      this.successMessage.set('Producto guardado exitosamente');
      this.loadProductos();
      this.resetForm();
      this.closeModal();
    } catch (error) {
      this.errorMessage.set('Error al guardar producto');
    }
  }

  deleteProducto(id: number) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      if (this.productoService.deleteProducto(id)) {
        this.successMessage.set('Producto eliminado exitosamente');
        this.loadProductos();
      } else {
        this.errorMessage.set('Error al eliminar producto');
      }
    }
  }

  resetForm() {
    this.nuevoProducto.set({
      nombre: '',
      descripcion: '',
      precio: 0,
      precioDeAdquisicion: 0,
      imagen: '',
      calificacion: 5,
      disponible: true
    });
  }

  updateField(field: keyof Producto, value: any) {
    this.nuevoProducto.update(producto => ({
      ...producto,
      [field]: value
    }));
  }

  private closeModal() {
    const modal = document.getElementById('nuevoProductoModal');
    const modalInstance = (window as any).bootstrap?.Modal?.getInstance(modal);
    if (modalInstance) {
      modalInstance.hide();
    }
  }
}
