import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-operador-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './operador-navbar.html',
  styleUrls: ['./operador-navbar.css']
})
export class OperadorNavbarComponent {
  userName = signal('');

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    const user = this.authService.loggedUser();
    this.userName.set(user?.nombreUsuario?.toString() || 'Operador');
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        console.log('✅ Sesión cerrada correctamente');
        this.router.navigate(['/home']).then(() => {
          this.notificationService.showWarning('Sesión cerrada con éxito.');
        });
      },
      error: (error) => {
        console.error('❌ Error al cerrar sesión:', error);
        // Redirigir de todas formas
        this.router.navigate(['/home']).then(() => {
          this.notificationService.showWarning('Sesión cerrada con éxito.');
        });
      }
    });
  }
}
