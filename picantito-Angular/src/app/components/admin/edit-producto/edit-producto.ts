import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminNavbarComponent } from '../../shared/admin-navbar/admin-navbar';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar';
import { Producto } from '../../../models/producto';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.loadProducto(id);
  }

  loadProducto(id: number) {
    // Datos de ejemplo - aquí llamarías al servicio real
    const productoEjemplo = {
      id: id,
      nombre: 'Taco de Carne Asada',
      descripcion: 'Delicioso taco con carne asada a la parrilla',
      precio: 12.99,
      imagen: '/images/taco1.jpg',
      calificacion: 5,
      disponible: true
    };
    this.producto.set(productoEjemplo);
  }

  updateProducto() {
    try {
      console.log('Actualizando producto:', this.producto());
      // Aquí llamarías al servicio para actualizar
      this.router.navigate(['/admin/productos']);
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
