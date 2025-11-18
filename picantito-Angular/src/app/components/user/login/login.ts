import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthNavbarComponent } from '../../shared/auth-navbar/auth-navbar';
import { AuthService } from '../../../services/auth.service';
import { PasswordResetService } from '../../../services/password-reset.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AuthNavbarComponent],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  nombreUsuario = signal('');
  password = signal('');
  errorMessage = signal('');
  isLoading = signal(false);

  // Estado para recuperación de contraseña
  showResetModal = signal(false);
  resetStep = signal<'email' | 'code' | 'verified' | 'password'>('email');
  resetEmail = signal('');
  resetCode = signal('');
  newPassword = signal('');
  confirmPassword = signal('');
  resetError = signal('');
  resetSuccess = signal('');
  isSendingCode = signal(false);
  resendTimeout = signal(0);
  private resendInterval: any;
  private returnUrl: string = '/home';

  constructor(
    private authService: AuthService,
    private passwordResetService: PasswordResetService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Capturar el returnUrl de los query params si existe
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }

  onSubmit() {
    if (!this.nombreUsuario() || !this.password()) {
      this.errorMessage.set('Por favor completa todos los campos');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    // Usar la API real
    this.authService.login(this.nombreUsuario(), this.password()).subscribe({
      next: (success) => {
        if (success) {
          // Si hay returnUrl, redirigir allí, sino usar redirectByRole
          if (this.returnUrl && this.returnUrl !== '/home') {
            this.router.navigate([this.returnUrl]);
          } else {
            // Redirigir según el rol del usuario usando el método del servicio
            this.authService.redirectByRole();
          }
        } else {
          this.errorMessage.set('Credenciales incorrectas');
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error en login:', error);
        this.errorMessage.set('Error al iniciar sesión. Intenta de nuevo.');
        this.isLoading.set(false);
      }
    });
  }

  updateNombreUsuario(value: string) {
    this.nombreUsuario.set(value);
  }

  updatePassword(value: string) {
    this.password.set(value);
  }

  // Métodos para recuperación de contraseña
  openResetModal() {
    this.showResetModal.set(true);
    this.resetStep.set('email');
    this.resetEmail.set('');
    this.resetCode.set('');
    this.newPassword.set('');
    this.confirmPassword.set('');
    this.resetError.set('');
    this.resetSuccess.set('');
  }

  closeResetModal() {
    this.showResetModal.set(false);
    if (this.resendInterval) {
      clearInterval(this.resendInterval);
      this.resendTimeout.set(0);
    }
  }

  sendResetCode() {
    if (!this.resetEmail()) {
      this.resetError.set('Por favor ingresa tu correo electrónico');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.resetEmail())) {
      this.resetError.set('Por favor ingresa un correo electrónico válido');
      return;
    }

    this.isSendingCode.set(true);
    this.resetError.set('');
    this.resetSuccess.set('');

    this.passwordResetService.sendResetCode(this.resetEmail()).subscribe({
      next: (response) => {
        console.log('Código de recuperación enviado:', response);
        this.resetSuccess.set('¡Código enviado! Revisa tu correo electrónico');
        this.resetStep.set('code');
        this.isSendingCode.set(false);
        this.startResendTimeout();
      },
      error: (error) => {
        console.error('Error al enviar código:', error);
        this.resetError.set(error.error?.message || 'Error al enviar el código. Intenta de nuevo.');
        this.isSendingCode.set(false);
      }
    });
  }

  // Almacenar los datos de login temporalmente
  private loginDataFromVerification: any = null;

  verifyResetCode() {
    if (!this.resetCode() || this.resetCode().length !== 6) {
      this.resetError.set('El código debe tener 6 caracteres');
      return;
    }

    this.isLoading.set(true);
    this.resetError.set('');

    this.passwordResetService.verifyResetCode(this.resetEmail(), this.resetCode()).subscribe({
      next: (response) => {
        console.log('Código verificado:', response);
        if (response.verified) {
          // Guardar los datos de login para usar después
          this.loginDataFromVerification = response.loginData;
          
          this.resetSuccess.set('¡Código verificado exitosamente!');
          this.resetError.set('');
          this.isLoading.set(false);
          // Cambiar al paso "verified" para dar opciones al usuario
          setTimeout(() => {
            this.resetStep.set('verified');
            this.resetSuccess.set('');
          }, 1500);
        } else {
          this.resetError.set('Código inválido o expirado');
          this.isLoading.set(false);
        }
      },
      error: (error) => {
        console.error('Error al verificar código:', error);
        this.resetError.set('Código inválido o expirado');
        this.isLoading.set(false);
      }
    });
  }

  resetPassword() {
    if (!this.newPassword() || this.newPassword().length < 6) {
      this.resetError.set('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (this.newPassword() !== this.confirmPassword()) {
      this.resetError.set('Las contraseñas no coinciden');
      return;
    }

    this.isLoading.set(true);
    this.resetError.set('');

    this.passwordResetService.resetPassword(
      this.resetEmail(),
      this.resetCode(),
      this.newPassword()
    ).subscribe({
      next: (response) => {
        console.log('Contraseña restablecida:', response);
        this.resetSuccess.set('¡Contraseña actualizada exitosamente!');
        this.isLoading.set(false);
        
        // Cerrar el modal después de 2 segundos
        setTimeout(() => {
          this.closeResetModal();
        }, 2000);
      },
      error: (error) => {
        console.error('Error al restablecer contraseña:', error);
        this.resetError.set(error.error?.message || 'Error al restablecer la contraseña');
        this.isLoading.set(false);
      }
    });
  }

  resendCode() {
    if (this.resendTimeout() > 0) return;
    this.resetCode.set('');
    this.sendResetCode();
  }

  private startResendTimeout() {
    this.resendTimeout.set(60);
    this.resendInterval = setInterval(() => {
      this.resendTimeout.set(this.resendTimeout() - 1);
      if (this.resendTimeout() <= 0) {
        clearInterval(this.resendInterval);
      }
    }, 1000);
  }

  backToEmail() {
    this.resetStep.set('email');
    this.resetCode.set('');
    this.resetError.set('');
    if (this.resendInterval) {
      clearInterval(this.resendInterval);
      this.resendTimeout.set(0);
    }
  }

  backToCode() {
    this.resetStep.set('code');
    this.newPassword.set('');
    this.confirmPassword.set('');
    this.resetError.set('');
  }

  continueToLogin() {
    // Verificar que tenemos los datos de login
    if (!this.loginDataFromVerification) {
      console.error('No hay datos de login disponibles');
      this.resetError.set('Error al iniciar sesión. Por favor, intente nuevamente.');
      return;
    }

    // Guardar el token y tipo de token en localStorage
    localStorage.setItem('token', this.loginDataFromVerification.token);
    localStorage.setItem('tokenType', this.loginDataFromVerification.type || 'Bearer');
    
    // Crear objeto de usuario para guardar en localStorage y signal
    const userData = {
      id: this.loginDataFromVerification.id,
      nombreUsuario: this.loginDataFromVerification.nombreUsuario,
      nombreCompleto: this.loginDataFromVerification.nombreCompleto,
      correo: this.loginDataFromVerification.correo,
      roles: this.loginDataFromVerification.roles
    };
    
    localStorage.setItem('loggedUser', JSON.stringify(userData));
    localStorage.setItem('roles', JSON.stringify(this.loginDataFromVerification.roles));
    
    // Actualizar el signal de usuario logueado en el servicio de autenticación
    this.authService.loggedUserSignal.set(userData);

    // Cerrar el modal
    this.closeResetModal();
    
    // Mostrar mensaje de éxito
    console.log('✅ Inicio de sesión automático exitoso');
    
    // Redirigir según el rol del usuario
    this.authService.redirectByRole();
  }
}
