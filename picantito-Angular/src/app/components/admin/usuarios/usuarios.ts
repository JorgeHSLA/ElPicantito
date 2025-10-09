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
  nuevoUsuario = signal<Usuario>({
    nombreCompleto: '',
    nombreUsuario: '',
    telefono: '',
    correo: '',
    contrasenia: ''
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
      },
      error: () => this.errorMessage.set('No se pudieron cargar los usuarios')
    });
  }

  saveUsuario() {
    const usuario = this.nuevoUsuario();
    if (!usuario.nombreCompleto || !usuario.nombreUsuario || !usuario.correo) {
      this.errorMessage.set('Complete los campos obligatorios');
      return;
    }
    this.authService.crearUsuario(usuario).subscribe({
      next: () => {
        this.successMessage.set('Usuario guardado exitosamente');
        this.loadUsuarios();
        this.resetForm();
        this.closeModal();
      },
      error: () => this.errorMessage.set('Error al guardar el usuario')
    });
  }

  deleteUsuario(id: number) {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
    this.authService.eliminarUsuario(id).subscribe({
      next: () => {
        this.successMessage.set('Usuario eliminado');
        this.loadUsuarios();
      },
      error: () => this.errorMessage.set('Error al eliminar el usuario')
    });
  }

  resetForm() {
    this.nuevoUsuario.set({ nombreCompleto: '', nombreUsuario: '', telefono: '', correo: '', contrasenia: '' });
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
