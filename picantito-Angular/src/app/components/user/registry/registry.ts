import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthNavbarComponent } from '../../shared/auth-navbar/auth-navbar';
import { AuthService } from '../../../services/auth.service';
import { VerificationService } from '../../../services/verification.service';

declare var bootstrap: any;

@Component({
  selector: 'app-registry',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AuthNavbarComponent],
  templateUrl: './registry.html',
  styleUrls: ['./registry.css']
})
export class RegistryComponent implements OnInit, AfterViewInit {
  
  // Modelo del formulario
  registryForm = {
    nombreCompleto: '',
    nombreUsuario: '',
    telefono: '',
    correo: '',
    password: '',
    password2: ''
  };

  // Estado del componente
  isLoading = false;
  error: string | null = null;
  success: string | null = null;

  // Control de verificación por email
  showVerificationStep = false;
  verificationCode = '';
  isEmailVerified = false;
  isSendingCode = false;
  codeError: string | null = null;
  resendTimeout = 0;
  private resendInterval: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private verificationService: VerificationService
  ) {}

  ngOnInit(): void {
    // Limpiar mensajes al inicializar
    this.error = null;
    this.success = null;
  }

  ngAfterViewInit(): void {
    this.initializeBootstrapComponents();
  }

  private initializeBootstrapComponents(): void {
    // Inicializar tooltips si existen
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(tooltipTriggerEl => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  // Enviar código de verificación
  sendVerificationCode(): void {
    if (!this.registryForm.correo) {
      this.error = 'Por favor ingresa un correo electrónico';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.registryForm.correo)) {
      this.error = 'Por favor ingresa un correo electrónico válido';
      return;
    }

    this.isSendingCode = true;
    this.error = null;
    this.codeError = null;

    this.verificationService.sendVerificationCode(this.registryForm.correo).subscribe({
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

    this.verificationService.verifyCode(this.registryForm.correo, this.verificationCode).subscribe({
      next: (response) => {
        console.log('Código verificado:', response);
        if (response.verified) {
          this.isEmailVerified = true;
          this.success = '¡Email verificado correctamente!';
          this.showVerificationStep = false;
          this.isLoading = false;
          // Proceder con el registro automáticamente
          setTimeout(() => this.completeRegistration(), 1000);
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
    if (this.resendInterval) {
      clearInterval(this.resendInterval);
      this.resendTimeout = 0;
    }
  }

  // Métodos del formulario
  onSubmit(): void {
    if (!this.isValidForm()) {
      return;
    }

    // Si el email no está verificado, mostrar modal de verificación
    if (!this.isEmailVerified) {
      this.sendVerificationCode();
      return;
    }

    // Si ya está verificado, proceder con el registro
    this.completeRegistration();
  }

  // Completar el registro después de la verificación
  private completeRegistration(): void {
    this.isLoading = true;
    this.error = null;

    // Crear el objeto usuario para la API
    // Nota: El estado debe ser null para usuarios normales (solo para repartidores)
    const nuevoUsuario = {
      nombreCompleto: this.registryForm.nombreCompleto,
      nombreUsuario: this.registryForm.nombreUsuario,
      telefono: this.registryForm.telefono,
      correo: this.registryForm.correo,
      contrasenia: this.registryForm.password,
      estado: null, // El backend solo acepta estado para repartidores
      rol: 'CLIENTE',
      activo: true
    };

    // Llamar a la API de registro
    this.authService.crearUsuario(nuevoUsuario).subscribe({
      next: (response: any) => {
        console.log('Usuario creado exitosamente:', response);
        this.success = '¡Cuenta creada exitosamente! Bienvenido a El Picantito';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error en registro:', error);
        // Manejar diferentes tipos de errores
        if (error.status === 409) {
          this.error = error.error || 'El nombre de usuario o correo ya está en uso';
        } else if (error.error && typeof error.error === 'string') {
          this.error = error.error;
        } else if (error.error?.message) {
          this.error = error.error.message;
        } else {
          this.error = 'Error al crear la cuenta. Intenta de nuevo.';
        }
        this.isLoading = false;
      }
    });
  }

  private isValidForm(): boolean {
    // Validar campos requeridos
    if (!this.registryForm.nombreCompleto || !this.registryForm.nombreUsuario || 
        !this.registryForm.telefono || !this.registryForm.correo || 
        !this.registryForm.password || !this.registryForm.password2) {
      this.error = 'Por favor completa todos los campos';
      return false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.registryForm.correo)) {
      this.error = 'Por favor ingresa un correo electrónico válido';
      return false;
    }

    // Validar contraseñas
    if (this.registryForm.password.length < 6) {
      this.error = 'La contraseña debe tener al menos 6 caracteres';
      return false;
    }

    if (this.registryForm.password !== this.registryForm.password2) {
      this.error = 'Las contraseñas no coinciden';
      return false;
    }

    // Validar teléfono (formato básico)
    const phoneRegex = /^[+]?[\d\s-()]+$/;
    if (!phoneRegex.test(this.registryForm.telefono)) {
      this.error = 'Por favor ingresa un número de teléfono válido';
      return false;
    }

    return true;
  }

  // Limpiar mensajes
  clearMessages(): void {
    this.error = null;
    this.success = null;
    this.codeError = null;
  }

  // Navegación
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }
}
