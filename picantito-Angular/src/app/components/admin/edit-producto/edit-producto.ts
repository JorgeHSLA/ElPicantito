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
    precioDeVenta: 0,
    imagen: '',
    calificacion: 5,
    disponible: true,
    activo: true,
    categoria: undefined
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
    this.productoService.getProductoById(id).subscribe({
      next: (producto) => {
        if (producto) {
          this.producto.set(producto);
        } else {
          console.error('Producto no encontrado');
          this.router.navigate(['/admin/productos']);
        }
      },
      error: (error) => {
        console.error('Error cargando producto:', error);
        this.router.navigate(['/admin/productos']);
      }
    });
  }

  updateProducto() {
    try {
      const productoActualizado = this.producto();
      if (productoActualizado.id) {
        this.productoService.actualizarProducto(productoActualizado.id, productoActualizado).subscribe({
          next: (resultado) => {
            console.log('Producto actualizado exitosamente:', resultado);
            this.router.navigate(['/admin/productos']);
          },
          error: (error) => {
            console.error('Error al actualizar producto:', error);
          }
        });
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
