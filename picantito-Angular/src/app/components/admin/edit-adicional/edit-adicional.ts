import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminNavbarComponent } from '../../shared/admin-navbar/admin-navbar';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar';
import { Adicional } from '../../../models/adicional';

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
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.loadAdicional(id);
  }

  loadAdicional(id: number) {
    // Datos de ejemplo - aquí llamarías al servicio real
    const adicionalEjemplo = {
      id: id,
      nombre: 'Queso Extra',
      descripcion: 'Queso cheddar adicional',
      precio: 2.50,
      disponible: true
    };
    this.adicional.set(adicionalEjemplo);
  }

  updateAdicional() {
    try {
      console.log('Actualizando adicional:', this.adicional());
      // Aquí llamarías al servicio para actualizar
      this.router.navigate(['/admin/adicionales']);
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
