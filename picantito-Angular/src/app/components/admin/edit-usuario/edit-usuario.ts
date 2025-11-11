import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminNavbarComponent } from '../../shared/admin-navbar/admin-navbar.component';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component';
import { Usuario } from '../../../models/usuario';
import { AuthService } from '../../../services/auth.service';

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
    contrasenia: '',
    rol: 'CLIENTE',
    activo: true
  });
  
  errorMessage = signal('');
  successMessage = signal('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.params['id'];
    if (id) this.loadUsuario(id);
  }

  loadUsuario(id: number) {
    this.authService.obtenerUsuario(id).subscribe({
      next: (usuario) => {
        if (usuario) {
          this.usuario.set(usuario);
        } else {
          this.errorMessage.set('Usuario no encontrado');
          setTimeout(() => this.router.navigate(['/admin/usuarios']), 2000);
        }
      },
      error: (err) => {
        console.error('Error al cargar usuario:', err);
        this.errorMessage.set('Error al cargar el usuario');
        setTimeout(() => this.router.navigate(['/admin/usuarios']), 2000);
      }
    });
  }

  updateUsuario() {
    const u = this.usuario();
    if (!u.id) {
      this.errorMessage.set('ID de usuario no válido');
      return;
    }
    
    if (!u.nombreCompleto || !u.nombreUsuario || !u.correo) {
      this.errorMessage.set('Complete todos los campos obligatorios');
      return;
    }
    
    this.authService.actualizarUsuario(u.id, u).subscribe({
      next: () => {
        this.successMessage.set('Usuario actualizado exitosamente');
        setTimeout(() => this.router.navigate(['/admin/usuarios']), 1500);
      },
      error: (err) => {
        console.error('Error al actualizar usuario:', err);
        const errorMsg = err.error?.message || err.error || 'Error al actualizar el usuario';
        this.errorMessage.set(errorMsg);
      }
    });
  }

  updateField(field: keyof Usuario, value: any) {
    this.usuario.update(curr => ({ ...curr, [field]: value }));
  }
}
