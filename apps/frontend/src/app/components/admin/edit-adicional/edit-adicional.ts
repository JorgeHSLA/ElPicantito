import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminNavbarComponent } from '../../shared/admin-navbar/admin-navbar.component';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component';
import { Adicional } from '../../../models/adicional';
import { AdministradorService } from '../../../services/usuarios/administrador.service';

@Component({
  selector: 'app-edit-adicional',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AdminNavbarComponent, AdminSidebarComponent],
  templateUrl: './edit-adicional.html',
  styleUrl: './edit-adicional.css'
})
export class EditAdicionalComponent implements OnInit {
  adicional = signal<Adicional>({
    id: undefined,
    nombre: '',
    descripcion: '',
    precio: 0,
    precioDeAdquisicion: 0,
    cantidad: 0,
    disponible: true
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
    this.loadAdicional(id);
  }

  loadAdicional(id: number) {
    const adicional = this.adminService.getAdicionalById(Number(id));
    if (adicional) {
      this.adicional.set({ ...adicional });
    } else {
      this.errorMessage.set('Adicional no encontrado');
      this.router.navigate(['/admin/adicionales']);
    }
  }

  updateAdicional() {
    try {
      this.adminService.saveAdicional(this.adicional());
      this.successMessage.set('Adicional actualizado exitosamente');
      setTimeout(() => {
        this.router.navigate(['/admin/adicionales']);
      }, 1500);
    } catch (error) {
      console.error('Error al actualizar adicional:', error);
      this.errorMessage.set('Error al actualizar el adicional');
    }
  }

  updateField(field: keyof Adicional, value: any) {
    this.adicional.update(adicional => ({
      ...adicional,
      [field]: value
    }));
  }
}
