import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-registry',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
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

    // Simular llamada a API (aquí integrarás con tu servicio de autenticación)
    setTimeout(() => {
      // Simulación de registro exitoso
      this.success = '¡Cuenta creada exitosamente! Bienvenido a El Picantito';
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 2000);
      this.isLoading = false;
    }, 2000);
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
