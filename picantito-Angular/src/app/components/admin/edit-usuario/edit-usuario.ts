import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminNavbarComponent } from '../../shared/admin-navbar/admin-navbar.component';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component';
import { Usuario } from '../../../models/usuario';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.loadUsuario(id);
  }

  loadUsuario(id: number) {
    // Datos de ejemplo - aquí llamarías al servicio real
    const usuarioEjemplo = {
      id: id,
      nombreCompleto: 'Carlos López García',
      nombreUsuario: 'carlos.lopez',
      telefono: '3009876543',
      correo: 'carlos@email.com',
      contrasenia: 'password123'
    };
    this.usuario.set(usuarioEjemplo);
  }

  updateUsuario() {
    try {
      console.log('Actualizando usuario:', this.usuario());
      // Aquí llamarías al servicio para actualizar
      this.router.navigate(['/admin/usuarios']);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
    }
  }

  updateField(field: keyof Usuario, value: any) {
    this.usuario.update(usuario => ({
      ...usuario,
      [field]: value
    }));
  }
}
