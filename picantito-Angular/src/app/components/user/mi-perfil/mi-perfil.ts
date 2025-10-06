declare var bootstrap: any;

import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Usuario } from '../../../models/usuario';

declare var bootstrap: any;

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './mi-perfil.html',
  styleUrls: ['./mi-perfil.css']
})
export class MiPerfilComponent implements OnInit, AfterViewInit {
  authService = inject(AuthService);
  router = inject(Router);

  usuario: Usuario = {};
  isLoading = false;
  error: string | null = null;
  success: string | null = null;
  showDeleteModal = false;

  ngOnInit(): void {
    this.error = null;
    this.success = null;
    // Obtener usuario logueado desde AuthService
    const user = this.authService.loggedUser();
    if (user) {
      // Obtener datos actualizados del backend
      this.authService.obtenerUsuario(user.id!).subscribe({
        next: (usuario) => {
          this.usuario = { ...usuario };
        },
        error: () => {
          // Si falla, usar lo que hay en el signal
          this.usuario = { ...user };
        }
      });
    }
  }

  ngAfterViewInit(): void {
    this.initializeBootstrapComponents();
  }

  private initializeBootstrapComponents(): void {
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(tooltipTriggerEl => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  onUpdateProfile(): void {
    if (!this.isValidForm()) {
      return;
    }
    this.isLoading = true;
    this.error = null;
    // Si el campo de contraseña está vacío, no lo mandes
    const usuarioUpdate: Usuario = { ...this.usuario };
    if (!usuarioUpdate.contrasenia && 'contrasenia' in usuarioUpdate) {
      delete usuarioUpdate.contrasenia;
    }
    this.authService.actualizarUsuario(this.usuario.id!, usuarioUpdate).subscribe({
      next: (usuarioActualizado) => {
        this.success = 'Perfil actualizado exitosamente';
        this.isLoading = false;
        this.usuario = { ...usuarioActualizado };
        // Actualizar el usuario en el signal y localStorage
        this.authService['loggedUserSignal'].set(usuarioActualizado);
        localStorage.setItem('loggedUser', JSON.stringify(usuarioActualizado));
        this.usuario.contrasenia = '';
      },
      error: (err) => {
        this.error = 'Error al actualizar el perfil';
        this.isLoading = false;
      }
    });
  }

  private isValidForm(): boolean {
    if (!this.usuario.nombreCompleto || !this.usuario.nombreUsuario ||
      !this.usuario.telefono || !this.usuario.correo) {
      this.error = 'Por favor completa todos los campos obligatorios';
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.usuario.correo!)) {
      this.error = 'Por favor ingresa un correo electrónico válido';
      return false;
    }
    return true;
  }

  openDeleteModal(): void {
    this.showDeleteModal = true;
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
    this.authService.eliminarUsuario(this.usuario.id!).subscribe({
      next: () => {
        this.success = 'Cuenta eliminada exitosamente';
        this.closeDeleteModal();
        this.authService.logout();
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 2000);
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Error al eliminar la cuenta';
        this.isLoading = false;
      }
    });
  }

  // Navegación y helpers
  navigateToStore(): void { this.router.navigate(['/tienda']); }
  navigateToAbout(): void { this.router.navigate(['/sobre-nosotros']); }
  navigateToHome(): void { this.router.navigate(['/home']); }
  navigateToAdmin(): void { if (this.usuario.rol === 'ADMIN') { this.router.navigate(['/admin']); } }
  logout(): void { this.authService.logout(); this.router.navigate(['/home']); }
  isAdmin(): boolean { return this.usuario.rol === 'ADMIN'; }
  clearMessages(): void { this.error = null; this.success = null; }
}
