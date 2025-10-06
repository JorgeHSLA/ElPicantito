import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminNavbarComponent } from '../../shared/admin-navbar/admin-navbar.component';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component';

import { Adicional } from '../../../models/adicional';
import { AdicionalService } from '../../../services/tienda/adicional.service';

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
    disponible: true
  });


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adicionalService: AdicionalService
  ) {}


  ngOnInit() {
    const id = +this.route.snapshot.params['id'];
    if (id) this.loadAdicional(id);
  }


  loadAdicional(id: number) {
    this.adicionalService.getAdicionalById(id).subscribe({
      next: (adicional) => {
        if (adicional) {
          this.adicional.set(adicional);
        } else {
          this.router.navigate(['/admin/adicionales']);
        }
      },
      error: () => this.router.navigate(['/admin/adicionales'])
    });
  }


  updateAdicional() {
    try {
      const adicionalActualizado = this.adicional();
      if (adicionalActualizado.id) {
        this.adicionalService.actualizarAdicional(adicionalActualizado.id, adicionalActualizado).subscribe({
          next: () => this.router.navigate(['/admin/adicionales']),
          error: (error) => console.error('Error al actualizar adicional:', error)
        });
      }
    } catch (error) {
      console.error('Error al actualizar adicional:', error);
    }
  }

  updateField(field: keyof Adicional, value: any) {
    this.adicional.update(adicional => ({
      ...adicional,
      [field]: value
    }));
  }
}
