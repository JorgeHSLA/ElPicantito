import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminNavbarComponent } from '../../shared/admin-navbar/admin-navbar';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar';
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
    // Datos de ejemplo - aquí llamarías al servicio real
    this.usuarios.set([
      {
        id: 1,
        nombreCompleto: 'Carlos López García',
        nombreUsuario: 'carlos.lopez',
        telefono: '3009876543',
        correo: 'carlos@email.com',
        contrasenia: 'password123'
      },
      {
        id: 2,
        nombreCompleto: 'Administrador Principal',
        nombreUsuario: 'admin',
        telefono: '3001234567',
        correo: 'admin@elpicantito.com',
        contrasenia: 'admin123'
      }
    ]);
  }

  saveUsuario() {
    try {
      console.log('Guardando usuario:', this.nuevoUsuario());
      this.successMessage.set('Usuario guardado exitosamente');
      this.loadUsuarios();
      this.resetForm();
    } catch (error) {
      this.errorMessage.set('Error al guardar el usuario');
    }
  }

  deleteUsuario(id: number) {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        console.log('Eliminando usuario:', id);
        this.successMessage.set('Usuario eliminado exitosamente');
        this.loadUsuarios();
      } catch (error) {
        this.errorMessage.set('Error al eliminar el usuario');
      }
    }
  }

  resetForm() {
    this.nuevoUsuario.set({
      nombreCompleto: '',
      nombreUsuario: '',
      telefono: '',
      correo: '',
      contrasenia: ''
    });
  }

  updateUsuarioField(field: keyof Usuario, value: any) {
    this.nuevoUsuario.update(usuario => ({
      ...usuario,
      [field]: value
    }));
  }
}
