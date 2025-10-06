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
    contrasenia: ''
  });

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
          this.router.navigate(['/admin/usuarios']);
        }
      },
      error: () => this.router.navigate(['/admin/usuarios'])
    });
  }

  updateUsuario() {
    try {
      const u = this.usuario();
      if (!u.id) return;
      this.authService.actualizarUsuario(u.id, u).subscribe({
        next: () => this.router.navigate(['/admin/usuarios']),
        error: (error) => console.error('Error al actualizar usuario:', error)
      });
    } catch {
      console.error('Error al actualizar usuario');
    }
  }

  updateField(field: keyof Usuario, value: any) {
    this.usuario.update(curr => ({ ...curr, [field]: value }));
  }
}
