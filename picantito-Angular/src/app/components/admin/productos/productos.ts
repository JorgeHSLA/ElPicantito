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
  productosFiltrados = signal<Producto[]>([]);

  // Filtros y búsqueda
  searchTerm = signal('');
  filtroDisponibilidad = signal('todos'); // 'todos', 'disponibles', 'no-disponibles'
  filtroOrden = signal('id-asc'); // 'id-asc', 'id-desc', 'nombre-asc', 'nombre-desc', 'precio-asc', 'precio-desc'

  nuevoProducto = signal<Producto>({
    nombre: '',
    descripcion: '',
    precioDeVenta: 0,
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

    // Configurar filtrado automático cuando cambian los filtros
    this.setupFilters();
  }

  setupFilters() {
    // En Angular con signals, puedes usar effect() pero para simplificar,
    // llamaremos aplicarFiltros() manualmente después de cada cambio
  }

  loadProductos() {
    this.productoService.getAllProductos().subscribe({
      next: (productos) => {
        // Ordenar productos por ID de forma ascendente
        const productosOrdenados = [...productos].sort((a, b) => {
          return (a.id || 0) - (b.id || 0);
        });
        this.productos.set(productosOrdenados);
        this.aplicarFiltros();
      },
      error: () => this.errorMessage.set('Error al cargar productos')
    });
  }

  aplicarFiltros() {
    let resultado = [...this.productos()];

    // Filtrar por búsqueda
    const termino = this.searchTerm().toLowerCase();
    if (termino) {
      resultado = resultado.filter(p =>
        p.nombre?.toLowerCase().includes(termino) ||
        p.descripcion?.toLowerCase().includes(termino)
      );
    }

    // Filtrar por disponibilidad
    const disponibilidad = this.filtroDisponibilidad();
    if (disponibilidad === 'disponibles') {
      resultado = resultado.filter(p => p.disponible === true);
    } else if (disponibilidad === 'no-disponibles') {
      resultado = resultado.filter(p => p.disponible === false);
    }

    // Ordenar
    const orden = this.filtroOrden();
    switch(orden) {
      case 'id-asc':
        resultado.sort((a, b) => (a.id || 0) - (b.id || 0));
        break;
      case 'id-desc':
        resultado.sort((a, b) => (b.id || 0) - (a.id || 0));
        break;
      case 'nombre-asc':
        resultado.sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));
        break;
      case 'nombre-desc':
        resultado.sort((a, b) => (b.nombre || '').localeCompare(a.nombre || ''));
        break;
      case 'precio-asc':
        resultado.sort((a, b) => (a.precioDeVenta || 0) - (b.precioDeVenta || 0));
        break;
      case 'precio-desc':
        resultado.sort((a, b) => (b.precioDeVenta || 0) - (a.precioDeVenta || 0));
        break;
    }

    this.productosFiltrados.set(resultado);
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
    this.aplicarFiltros();
  }

  onFiltroDisponibilidadChange(value: string) {
    this.filtroDisponibilidad.set(value);
    this.aplicarFiltros();
  }

  onFiltroOrdenChange(value: string) {
    this.filtroOrden.set(value);
    this.aplicarFiltros();
  }

  limpiarFiltros() {
    this.searchTerm.set('');
    this.filtroDisponibilidad.set('todos');
    this.filtroOrden.set('id-asc');
    this.aplicarFiltros();
  }

  saveProducto() {
    let producto = this.nuevoProducto();
    // Compatibilidad: si solo hay 'precio', pásalo a 'precioDeVenta'
    if (producto.precio && !producto.precioDeVenta) {
      producto = { ...producto, precioDeVenta: producto.precio };
    }
    this.productoService.crearProducto(producto).subscribe({
      next: () => {
        this.successMessage.set('Producto guardado exitosamente');
        this.loadProductos();
        this.resetForm();
        this.closeModal();
      },
      error: () => this.errorMessage.set('Error al guardar producto')
    });
  }

  deleteProducto(id: number) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productoService.eliminarProducto(id).subscribe({
        next: () => {
          this.successMessage.set('Producto eliminado exitosamente');
          this.loadProductos();
        },
        error: () => this.errorMessage.set('Error al eliminar producto')
      });
    }
  }

  resetForm() {
    this.nuevoProducto.set({
      nombre: '',
      descripcion: '',
      precioDeVenta: 0,
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
