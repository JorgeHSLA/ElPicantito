import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminNavbarComponent } from '../../shared/admin-navbar/admin-navbar.component';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component';
import { Usuario } from '../../../models/usuario';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AdminNavbarComponent, AdminSidebarComponent],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class UsuariosComponent implements OnInit {
  usuarios = signal<Usuario[]>([]);
  usuariosFiltrados = signal<Usuario[]>([]);
  
  // Filtros y búsqueda
  searchTerm = signal('');
  filtroRol = signal('todos'); // 'todos', 'ADMIN', 'OPERADOR', 'CLIENTE', 'REPARTIDOR'
  filtroEstado = signal('todos'); // 'todos', 'activos', 'inactivos'
  filtroOrden = signal('id-asc');
  
  nuevoUsuario = signal<Usuario>({
    nombreCompleto: '',
    nombreUsuario: '',
    telefono: '',
    correo: '',
    contrasenia: '',
    rol: 'CLIENTE',
    activo: true
  });
  successMessage = signal('');
  errorMessage = signal('');

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadUsuarios();
  }

  loadUsuarios() {
    this.authService.getAllUsuarios().subscribe({
      next: (usuarios) => {
        // Ordenar usuarios por ID de forma ascendente
        const usuariosOrdenados = [...usuarios].sort((a, b) => {
          return (a.id || 0) - (b.id || 0);
        });
        this.usuarios.set(usuariosOrdenados);
        this.aplicarFiltros();
      },
      error: () => this.errorMessage.set('No se pudieron cargar los usuarios')
    });
  }

  aplicarFiltros() {
    let resultado = [...this.usuarios()];
    
    const termino = this.searchTerm().toLowerCase();
    if (termino) {
      resultado = resultado.filter(u => 
        u.nombreCompleto?.toLowerCase().includes(termino) ||
        u.nombreUsuario?.toLowerCase().includes(termino) ||
        u.correo?.toLowerCase().includes(termino) ||
        u.telefono?.includes(termino)
      );
    }
    
    const rol = this.filtroRol();
    if (rol !== 'todos') {
      resultado = resultado.filter(u => u.rol === rol);
    }
    
    const estado = this.filtroEstado();
    if (estado === 'activos') {
      resultado = resultado.filter(u => u.activo === true);
    } else if (estado === 'inactivos') {
      resultado = resultado.filter(u => u.activo === false);
    }
    
    const orden = this.filtroOrden();
    switch(orden) {
      case 'id-asc':
        resultado.sort((a, b) => (a.id || 0) - (b.id || 0));
        break;
      case 'id-desc':
        resultado.sort((a, b) => (b.id || 0) - (a.id || 0));
        break;
      case 'nombre-asc':
        resultado.sort((a, b) => (a.nombreCompleto || '').localeCompare(b.nombreCompleto || ''));
        break;
      case 'nombre-desc':
        resultado.sort((a, b) => (b.nombreCompleto || '').localeCompare(a.nombreCompleto || ''));
        break;
    }
    
    this.usuariosFiltrados.set(resultado);
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
    this.aplicarFiltros();
  }

  onFiltroRolChange(value: string) {
    this.filtroRol.set(value);
    this.aplicarFiltros();
  }

  onFiltroEstadoChange(value: string) {
    this.filtroEstado.set(value);
    this.aplicarFiltros();
  }

  onFiltroOrdenChange(value: string) {
    this.filtroOrden.set(value);
    this.aplicarFiltros();
  }

  limpiarFiltros() {
    this.searchTerm.set('');
    this.filtroRol.set('todos');
    this.filtroEstado.set('todos');
    this.filtroOrden.set('id-asc');
    this.aplicarFiltros();
  }

  saveUsuario() {
    const usuario = this.nuevoUsuario();
    if (!usuario.nombreCompleto || !usuario.nombreUsuario || !usuario.correo || !usuario.contrasenia) {
      this.errorMessage.set('Complete todos los campos obligatorios');
      return;
    }
    
    // Asegurar que tenga un rol válido
    if (!usuario.rol) {
      usuario.rol = 'CLIENTE';
    }
    
    // Crear un objeto plano para enviar al backend (sin signals)
    const usuarioData: Usuario = {
      nombreCompleto: usuario.nombreCompleto,
      nombreUsuario: usuario.nombreUsuario,
      telefono: usuario.telefono,
      correo: usuario.correo,
      contrasenia: usuario.contrasenia,
      rol: usuario.rol,
      activo: usuario.activo
    };
    
    console.log('🔍 Usuario a crear:', usuarioData);
    console.log('🔍 Rol seleccionado:', usuarioData.rol);
    
    this.authService.crearUsuario(usuarioData).subscribe({
      next: () => {
        this.successMessage.set('Usuario guardado exitosamente');
        this.loadUsuarios();
        this.resetForm();
        this.closeModal();
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        const errorMsg = err.error?.message || err.error || 'Error al guardar el usuario';
        this.errorMessage.set(errorMsg);
      }
    });
  }

  deleteUsuario(id: number) {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
    this.authService.eliminarUsuario(id).subscribe({
      next: () => {
        this.successMessage.set('Usuario eliminado exitosamente');
        this.loadUsuarios();
      },
      error: (err) => {
        console.error('Error al eliminar:', err);
        const errorMsg = err.error?.message || err.error || 'Error al eliminar el usuario';
        this.errorMessage.set(errorMsg);
      }
    });
  }

  resetForm() {
    this.nuevoUsuario.set({ 
      nombreCompleto: '', 
      nombreUsuario: '', 
      telefono: '', 
      correo: '', 
      contrasenia: '',
      rol: 'CLIENTE',
      activo: true
    });
  }

  updateUsuarioField(field: keyof Usuario, value: any) {
    this.nuevoUsuario.update(u => ({ ...u, [field]: value }));
  }

  private closeModal() {
    const modal = document.getElementById('nuevoUsuarioModal');
    const modalInstance = (window as any).bootstrap?.Modal?.getInstance(modal);
    if (modalInstance) {
      modalInstance.hide();
    }
  }
}
