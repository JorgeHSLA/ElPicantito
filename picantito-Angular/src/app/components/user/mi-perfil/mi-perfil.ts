import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './mi-perfil.html',
  styleUrls: ['./mi-perfil.css']
})
export class MiPerfilComponent implements OnInit, AfterViewInit {
  
  // Datos del usuario (simulados por ahora)
  usuario = {
    id: 1,
    nombreCompleto: 'Juan Pérez García',
    nombreUsuario: 'juan.perez',
    telefono: '+57 300 123 4567',
    correo: 'juan@email.com',
    role: 'USER',
    fechaRegistro: 'Enero 2024',
    pedidosRealizados: 0,
    password: ''
  };

  // Estado del componente
  isLoading = false;
  error: string | null = null;
  success: string | null = null;
  showDeleteModal = false;

  // Estado del usuario logueado (simulado)
  loggedUser: any = this.usuario; // Aquí integrarás con tu servicio de autenticación

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Limpiar mensajes al inicializar
    this.error = null;
    this.success = null;
  }

  ngAfterViewInit(): void {
    this.initializeBootstrapComponents();
  }

  private initializeBootstrapComponents(): void {
    // Inicializar tooltips
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(tooltipTriggerEl => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  // Métodos del formulario
  onUpdateProfile(): void {
    if (!this.isValidForm()) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    // Simular llamada a API (aquí integrarás con tu servicio)
    setTimeout(() => {
      this.success = 'Perfil actualizado exitosamente';
      this.isLoading = false;
      // Limpiar password después de actualizar
      this.usuario.password = '';
    }, 1500);
  }

  private isValidForm(): boolean {
    if (!this.usuario.nombreCompleto || !this.usuario.nombreUsuario || 
        !this.usuario.telefono || !this.usuario.correo) {
      this.error = 'Por favor completa todos los campos obligatorios';
      return false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.usuario.correo)) {
      this.error = 'Por favor ingresa un correo electrónico válido';
      return false;
    }

    return true;
  }

  // Manejo del modal de eliminación
  openDeleteModal(): void {
    this.showDeleteModal = true;
    // Usar Bootstrap modal si está disponible
    const modalElement = document.getElementById('deleteAccountModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    const modalElement = document.getElementById('deleteAccountModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }

  confirmDeleteAccount(): void {
    this.isLoading = true;
    
    // Simular eliminación de cuenta
    setTimeout(() => {
      this.success = 'Cuenta eliminada exitosamente';
      this.closeDeleteModal();
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 2000);
      this.isLoading = false;
    }, 1500);
  }

  // Navegación
  navigateToStore(): void {
    this.router.navigate(['/tienda']);
  }

  navigateToAbout(): void {
    this.router.navigate(['/sobre-nosotros']);
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  navigateToAdmin(): void {
    // Solo si es admin
    if (this.usuario.role === 'ADMIN') {
      console.log('Navegando al panel de administración');
    }
  }

  logout(): void {
    // Implementar logout
    console.log('Cerrando sesión');
    this.router.navigate(['/home']);
  }

  // Helpers
  isAdmin(): boolean {
    return this.usuario.role === 'ADMIN';
  }

  // Limpiar mensajes
  clearMessages(): void {
    this.error = null;
    this.success = null;
  }
}
