import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthNavbarComponent } from '../../shared/auth-navbar/auth-navbar';

declare var bootstrap: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AuthNavbarComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
  
  // Modelo del formulario
  loginForm = {
    nombreUsuario: '',
    password: ''
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
      // Simulación de autenticación
      if (this.loginForm.nombreUsuario === 'admin' && this.loginForm.password === 'admin123') {
        this.success = '¡Bienvenido! Iniciando sesión...';
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1000);
      } else if (this.loginForm.nombreUsuario && this.loginForm.password) {
        this.success = '¡Bienvenido! Iniciando sesión...';
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1000);
      } else {
        this.error = 'Credenciales incorrectas';
      }
      this.isLoading = false;
    }, 1500);
  }

  private isValidForm(): boolean {
    if (!this.loginForm.nombreUsuario || !this.loginForm.password) {
      this.error = 'Por favor completa todos los campos';
      return false;
    }
    return true;
  }

  // Navegación
  navigateToRegistry(): void {
    this.router.navigate(['/registry']);
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
