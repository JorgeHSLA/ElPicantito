import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthNavbarComponent } from '../../shared/auth-navbar/auth-navbar';
import { AuthService } from '../../../services/auth.service';

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

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.nombreUsuario() || !this.password()) {
      this.errorMessage.set('Por favor completa todos los campos');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    // Simular delay de autenticación
    setTimeout(() => {
      const loginSuccess = this.authService.login(this.nombreUsuario(), this.password());
      
      if (loginSuccess) {
        this.router.navigate(['/home']);
      } else {
        this.errorMessage.set('Credenciales incorrectas');
      }
      
      this.isLoading.set(false);
    }, 1000);
  }

  updateNombreUsuario(value: string) {
    this.nombreUsuario.set(value);
  }

  updatePassword(value: string) {
    this.password.set(value);
  }
}
