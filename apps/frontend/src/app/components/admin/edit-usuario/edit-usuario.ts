import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminNavbarComponent } from '../../shared/admin-navbar/admin-navbar.component';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component';
import { Usuario } from '../../../models/usuario';
import { AdministradorService } from '../../../services/usuarios/administrador.service';

@Component({
  selector: 'app-edit-usuario',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AdminNavbarComponent, AdminSidebarComponent],
  templateUrl: './edit-usuario.html',
  styleUrl: './edit-usuario.css'
})
export class EditUsuarioComponent implements OnInit {
  usuario = signal<Usuario>({
    id: undefined,
    nombreCompleto: '',
    nombreUsuario: '',
    telefono: '',
    correo: '',
    contrasenia: ''
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
    this.loadUsuario(id);
  }

  loadUsuario(id: number) {
    const usuario = this.adminService.getUserById(Number(id));
    if (usuario) {
      this.usuario.set({ ...usuario });
    } else {
      this.errorMessage.set('Usuario no encontrado');
      this.router.navigate(['/admin/usuarios']);
    }
  }

  updateUsuario() {
    try {
      this.adminService.saveUsuario(this.usuario());
      this.successMessage.set('Usuario actualizado exitosamente');
      setTimeout(() => {
        this.router.navigate(['/admin/usuarios']);
      }, 1500);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      this.errorMessage.set('Error al actualizar el usuario');
    }
  }

  updateField(field: keyof Usuario, value: any) {
    this.usuario.update(usuario => ({
      ...usuario,
      [field]: value
    }));
  }
}
