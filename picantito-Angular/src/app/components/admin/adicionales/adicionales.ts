import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminNavbarComponent } from '../../shared/admin-navbar/admin-navbar';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar';
import { Adicional } from '../../../models/adicional';
import { AdicionalService } from '../../../services/tienda/adicional.service';

@Component({
  selector: 'app-adicionales',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AdminNavbarComponent, AdminSidebarComponent],
  templateUrl: './adicionales.html',
  styleUrl: './adicionales.css'
})
export class AdicionalesComponent implements OnInit {
  adicionales = signal<Adicional[]>([]);
  nuevoAdicional = signal<Adicional>({
    nombre: '',
    descripcion: '',
    precio: 0,
    disponible: true
  });
  
  successMessage = signal('');
  errorMessage = signal('');

  constructor(private adicionalService: AdicionalService) {}

  ngOnInit() {
    this.loadAdicionales();
  }

  loadAdicionales() {
    this.adicionales.set(this.adicionalService.getAdicionales()());
  }

  saveAdicional() {
    try {
      this.adicionalService.saveAdicional(this.nuevoAdicional());
      this.successMessage.set('Adicional guardado exitosamente');
      this.loadAdicionales();
      this.resetForm();
    } catch (error) {
      this.errorMessage.set('Error al guardar el adicional');
    }
  }

  deleteAdicional(id: number) {
    if (confirm('¿Estás seguro de eliminar este adicional?')) {
      try {
        this.adicionalService.deleteAdicional(id);
        this.successMessage.set('Adicional eliminado exitosamente');
        this.loadAdicionales();
      } catch (error) {
        this.errorMessage.set('Error al eliminar el adicional');
      }
    }
  }

  resetForm() {
    this.nuevoAdicional.set({
      nombre: '',
      descripcion: '',
      precio: 0,
      disponible: true
    });
  }

  updateAdicionalField(field: keyof Adicional, value: any) {
    this.nuevoAdicional.update(adicional => ({
      ...adicional,
      [field]: value
    }));
  }
}
