import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminNavbarComponent } from '../../shared/admin-navbar/admin-navbar.component';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component';
import { Usuario } from '../../../models/usuario';
import { AuthService } from '../../../services/auth.service';
import { AdministradorService } from '../../../services/usuarios/administrador.service';

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

  constructor(private authService: AuthService, private adminService: AdministradorService) {}

  ngOnInit() {
    this.loadUsuarios();
  }

  loadUsuarios() {
    // Cargar desde el servicio (signal readonly)
    try {
      this.usuarios.set(this.adminService.getUsuarios()());
    } catch {
      this.errorMessage.set('No se pudieron cargar los usuarios');
    }
  }

  saveUsuario() {
    try {
      const usuario = this.nuevoUsuario();
      if (!usuario.nombreCompleto || !usuario.nombreUsuario || !usuario.correo) {
        this.errorMessage.set('Complete los campos obligatorios');
        return;
      }
      this.adminService.saveUsuario(usuario);
      this.successMessage.set('Usuario guardado exitosamente');
      this.loadUsuarios();
      this.resetForm();
      // Cerrar modal manualmente si Bootstrap (opcional)
      const modalEl = document.getElementById('nuevoUsuarioModal');
      if (modalEl) {
        // @ts-ignore
        const modal = bootstrap?.Modal?.getInstance(modalEl) || new (window as any).bootstrap.Modal(modalEl);
        modal.hide();
      }
    } catch {
      this.errorMessage.set('Error al guardar el usuario');
    }
  }

  deleteUsuario(id: number) {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
    try {
      this.adminService.deleteUsuario(id);
      this.successMessage.set('Usuario eliminado');
      this.loadUsuarios();
    } catch {
      this.errorMessage.set('Error al eliminar el usuario');
    }
  }

  resetForm() {
    this.nuevoUsuario.set({ nombreCompleto: '', nombreUsuario: '', telefono: '', correo: '', contrasenia: '' });
  }

  updateUsuarioField(field: keyof Usuario, value: any) {
    this.nuevoUsuario.update(u => ({ ...u, [field]: value }));
  }
}
