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
    contrasenia: '',
    rol: 'USER',
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
      },
      error: () => this.errorMessage.set('No se pudieron cargar los usuarios')
    });
  }

  saveUsuario() {
    const usuario = this.nuevoUsuario();
    if (!usuario.nombreCompleto || !usuario.nombreUsuario || !usuario.correo || !usuario.contrasenia) {
      this.errorMessage.set('Complete todos los campos obligatorios');
      return;
    }
    
    // Asegurar que tenga un rol válido
    if (!usuario.rol) {
      usuario.rol = 'USER';
    }
    
    this.authService.crearUsuario(usuario).subscribe({
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
      rol: 'USER',
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
