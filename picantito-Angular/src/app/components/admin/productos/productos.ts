import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminNavbarComponent } from '../../shared/admin-navbar/admin-navbar.component';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component';
import { Producto } from '../../../models/producto';
import { AdministradorService } from '../../../services/usuarios/administrador.service';

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
    imagen: '',
    calificacion: 5,
    disponible: true
  });
  
  successMessage = signal('');
  errorMessage = signal('');

  constructor(private adminService: AdministradorService) {}

  ngOnInit() {
    this.loadProductos();
  }

  loadProductos() {
    this.productos.set(this.adminService.getProductos()());
  }

  saveProducto() {
    this.adminService.saveProducto(this.nuevoProducto());
    this.successMessage.set('Producto guardado exitosamente');
    this.loadProductos();
    this.resetForm();
  }

  deleteProducto(id: number) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.adminService.deleteProducto(id);
      this.successMessage.set('Producto eliminado exitosamente');
      this.loadProductos();
    }
  }

  resetForm() {
    this.nuevoProducto.set({
      nombre: '',
      descripcion: '',
      precio: 0,
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
}
