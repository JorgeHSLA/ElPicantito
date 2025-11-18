declare var bootstrap: any;

import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CarritoService } from '../../../services/carrito.service';
import { VerificationService } from '../../../services/verification.service';
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
  carritoService = inject(CarritoService);
  verificationService = inject(VerificationService);

  usuario: Usuario = {};
  usuarioPendiente: Usuario = {}; // Guardar cambios pendientes de verificación
  isLoading = false;
  error: string | null = null;
  success: string | null = null;
  showDeleteModal = false;

  // Variables para verificación de correo
  showVerificationStep = false;
  verificationCode = '';
  codeError: string | null = null;
  isSendingCode = false;
  resendTimeout = 0;
  resendInterval: any;

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

    // Guardar cambios pendientes y solicitar verificación
    this.usuarioPendiente = { ...this.usuario };
    this.sendVerificationCode();
  }

  // Enviar código de verificación
  sendVerificationCode(): void {
    this.isSendingCode = true;
    this.error = null;
    this.codeError = null;

    this.verificationService.sendVerificationCode(this.usuario.correo!).subscribe({
      next: (response) => {
        console.log('Código enviado:', response);
        this.showVerificationStep = true;
        this.success = '¡Código enviado! Revisa tu correo electrónico';
        this.isSendingCode = false;
        this.startResendTimeout();
      },
      error: (error) => {
        console.error('Error al enviar código:', error);
        this.error = 'Error al enviar el código. Intenta de nuevo.';
        this.isSendingCode = false;
      }
    });
  }

  // Verificar código ingresado
  verifyEmailCode(): void {
    if (!this.verificationCode || this.verificationCode.length !== 6) {
      this.codeError = 'El código debe tener 6 caracteres';
      return;
    }

    this.isLoading = true;
    this.codeError = null;

    this.verificationService.verifyCode(this.usuario.correo!, this.verificationCode).subscribe({
      next: (response) => {
        console.log('Código verificado:', response);
        if (response.verified) {
          this.success = '¡Email verificado correctamente!';
          this.showVerificationStep = false;
          this.isLoading = false;
          // Proceder con la actualización del perfil
          setTimeout(() => this.completeProfileUpdate(), 1000);
        } else {
          this.codeError = 'Código inválido o expirado';
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error al verificar código:', error);
        this.codeError = 'Código inválido o expirado';
        this.isLoading = false;
      }
    });
  }

  // Completar actualización del perfil después de verificar
  completeProfileUpdate(): void {
    this.isLoading = true;
    this.error = null;

    // Si el campo de contraseña está vacío, no lo mandes
    const usuarioUpdate: Usuario = { ...this.usuarioPendiente };
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
        this.verificationCode = '';
        this.usuarioPendiente = {};
      },
      error: (err) => {
        this.error = 'Error al actualizar el perfil';
        this.isLoading = false;
      }
    });
  }

  // Reenviar código
  resendCode(): void {
    if (this.resendTimeout > 0) return;
    this.verificationCode = '';
    this.sendVerificationCode();
  }

  // Temporizador para reenvío
  private startResendTimeout(): void {
    this.resendTimeout = 60;
    this.resendInterval = setInterval(() => {
      this.resendTimeout--;
      if (this.resendTimeout <= 0) {
        clearInterval(this.resendInterval);
      }
    }, 1000);
  }

  // Cancelar verificación
  cancelVerification(): void {
    this.showVerificationStep = false;
    this.verificationCode = '';
    this.codeError = null;
    this.usuarioPendiente = {};
    if (this.resendInterval) {
      clearInterval(this.resendInterval);
      this.resendTimeout = 0;
    }
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
        // Cerrar el modal primero
        this.closeDeleteModal();
        
        // Limpiar el carrito
        this.carritoService.limpiarTodoElSistema();
        
        // Hacer logout para limpiar la sesión
        this.authService.logout().subscribe({
          next: () => {
            // Mostrar mensaje de éxito
            this.success = 'Cuenta eliminada exitosamente. Serás redirigido...';
            
            // Redirigir después de un breve delay
            setTimeout(() => {
              this.isLoading = false;
              this.router.navigate(['/home']);
            }, 1500);
          },
          error: () => {
            // Aunque falle el logout, igual redirigir
            this.isLoading = false;
            this.router.navigate(['/home']);
          }
        });
      },
      error: () => {
        this.error = 'Error al eliminar la cuenta';
        this.closeDeleteModal();
        this.isLoading = false;
      }
    });
  }

  // Navegación y helpers
  navigateToStore(): void { this.router.navigate(['/tienda']); }
  navigateToAbout(): void { this.router.navigate(['/sobre-nosotros']); }
  navigateToHome(): void { this.router.navigate(['/home']); }
  navigateToAdmin(): void { if (this.usuario.rol === 'ADMIN') { this.router.navigate(['/admin']); } }
  logout(): void { this.authService.logout(); this.carritoService.limpiarTodoElSistema(); this.router.navigate(['/home']); }
  isAdmin(): boolean { return this.usuario.rol === 'ADMIN'; }
  clearMessages(): void { this.error = null; this.success = null; }
}
