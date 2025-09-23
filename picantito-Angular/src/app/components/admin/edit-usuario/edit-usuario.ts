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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdministradorService
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.params['id'];
    if (id) this.loadUsuario(id);
  }

  loadUsuario(id: number) {
    const u = this.adminService.getUserById(id);
    if (!u) { this.router.navigate(['/admin/usuarios']); return; }
    this.usuario.set({ ...u });
  }

  updateUsuario() {
    try {
      const u = this.usuario();
      if (!u.id) return;
      this.adminService.saveUsuario(u); // reutiliza lógica (update si hay id)
      this.router.navigate(['/admin/usuarios']);
    } catch {
      console.error('Error al actualizar usuario');
    }
  }

  updateField(field: keyof Usuario, value: any) {
    this.usuario.update(curr => ({ ...curr, [field]: value }));
  }
}
