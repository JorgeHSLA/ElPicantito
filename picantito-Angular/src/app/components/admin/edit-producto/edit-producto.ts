import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminNavbarComponent } from '../../shared/admin-navbar/admin-navbar.component';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component';
import { Producto } from '../../../models/producto';
import { ProductoService } from '../../../services/tienda/producto.service';

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
    precioDeAdquisicion: 0,
    imagen: '',
    calificacion: 5,
    disponible: true
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productoService: ProductoService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.loadProducto(+id);
  }

  loadProducto(id: number) {
    const producto = this.productoService.getProductoById(id);
    if (producto) {
      this.producto.set(producto);
    } else {
      console.error('Producto no encontrado');
      this.router.navigate(['/admin/productos']);
    }
  }

  updateProducto() {
    try {
      const productoActualizado = this.producto();
      if (productoActualizado.id) {
        this.productoService.updateProducto(productoActualizado.id, productoActualizado);
        console.log('Producto actualizado exitosamente');
        this.router.navigate(['/admin/productos']);
      }
    } catch (error) {
      console.error('Error al actualizar producto:', error);
    }
  }

  updateField(field: keyof Producto, value: any) {
    this.producto.update(producto => ({
      ...producto,
      [field]: value
    }));
  }
}
