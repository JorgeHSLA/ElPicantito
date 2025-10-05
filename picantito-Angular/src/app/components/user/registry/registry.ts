import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthNavbarComponent } from '../../shared/auth-navbar/auth-navbar';
import { AuthService } from '../../../services/auth.service';

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

  constructor(
    private router: Router,
    private authService: AuthService
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

  // Métodos del formulario
  onSubmit(): void {
    if (!this.isValidForm()) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    // Crear el objeto usuario para la API
    const nuevoUsuario = {
      nombreCompleto: this.registryForm.nombreCompleto,
      nombreUsuario: this.registryForm.nombreUsuario,
      telefono: this.registryForm.telefono,
      correo: this.registryForm.correo,
      contrasenia: this.registryForm.password,
      estado: 'ACTIVO',
      rol: 'USER'
    };

    // Llamar a la API de registro
    this.authService.crearUsuario(nuevoUsuario).subscribe({
      next: (response: any) => {
        this.success = '¡Cuenta creada exitosamente! Bienvenido a El Picantito';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error en registro:', error);
        this.error = error.error?.message || 'Error al crear la cuenta. Intenta de nuevo.';
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

  // Navegación
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  // Limpiar mensajes
  clearMessages(): void {
    this.error = null;
    this.success = null;
  }
}
