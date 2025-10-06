import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminNavbarComponent } from '../../shared/admin-navbar/admin-navbar.component';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component';
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
    precioDeVenta: 0,
    disponible: true
  });
  
  successMessage = signal('');
  errorMessage = signal('');

  constructor(private adicionalService: AdicionalService) {}

  ngOnInit() {
    this.loadAdicionales();
  }

  loadAdicionales() {
    this.adicionalService.getAllAdicionales().subscribe({
      next: (adicionales) => this.adicionales.set(adicionales),
      error: () => this.errorMessage.set('Error al cargar adicionales')
    });
  }

  saveAdicional() {
    let adicional = this.nuevoAdicional();
    // Compatibilidad: si solo hay 'precio', pásalo a 'precioDeVenta'
    if (adicional.precio && !adicional.precioDeVenta) {
      adicional = { ...adicional, precioDeVenta: adicional.precio };
    }
    this.adicionalService.crearAdicional(adicional).subscribe({
      next: () => {
        this.successMessage.set('Adicional guardado exitosamente');
        this.loadAdicionales();
        this.resetForm();
        this.closeModal();
      },
      error: () => this.errorMessage.set('Error al guardar el adicional')
    });
  }

  deleteAdicional(id: number) {
    if (confirm('¿Estás seguro de eliminar este adicional?')) {
      this.adicionalService.eliminarAdicional(id).subscribe({
        next: () => {
          this.successMessage.set('Adicional eliminado exitosamente');
          this.loadAdicionales();
        },
        error: () => this.errorMessage.set('Error al eliminar el adicional')
      });
    }
  }

  resetForm() {
    this.nuevoAdicional.set({
      nombre: '',
      descripcion: '',
      precioDeVenta: 0,
      disponible: true
    });
  }

  updateAdicionalField(field: keyof Adicional, value: any) {
    this.nuevoAdicional.update(adicional => ({
      ...adicional,
      [field]: value
    }));
  }

  private closeModal() {
    const modal = document.getElementById('nuevoAdicionalModal');
    const modalInstance = (window as any).bootstrap?.Modal?.getInstance(modal);
    if (modalInstance) {
      modalInstance.hide();
    }
  }
}
