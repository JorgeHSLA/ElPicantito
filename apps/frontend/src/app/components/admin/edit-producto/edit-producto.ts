import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminNavbarComponent } from '../../shared/admin-navbar/admin-navbar.component';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component';
import { Producto } from '../../../models/producto';
import { AdministradorService } from '../../../services/usuarios/administrador.service';

@Component({
  selector: 'app-edit-producto',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AdminNavbarComponent, AdminSidebarComponent],
  templateUrl: './edit-producto.html',
  styleUrl: './edit-producto.css'
})
export class EditProductoComponent implements OnInit {
  producto = signal<Producto>({
    id: undefined,
    nombre: '',
    descripcion: '',
    precio: 0,
    imagen: '',
    calificacion: 5,
    disponible: true
  });

  successMessage = signal('');
  errorMessage = signal('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdministradorService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.loadProducto(id);
  }

  loadProducto(id: number) {
    const producto = this.adminService.getProductoById(Number(id));
    if (producto) {
      this.producto.set({ ...producto });
    } else {
      this.errorMessage.set('Producto no encontrado');
      this.router.navigate(['/admin/productos']);
    }
  }

  updateProducto() {
    try {
      this.adminService.saveProducto(this.producto());
      this.successMessage.set('Producto actualizado exitosamente');
      setTimeout(() => {
        this.router.navigate(['/admin/productos']);
      }, 1500);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      this.errorMessage.set('Error al actualizar el producto');
    }
  }

  updateField(field: keyof Producto, value: any) {
    this.producto.update(producto => ({
      ...producto,
      [field]: value
    }));
  }
}
