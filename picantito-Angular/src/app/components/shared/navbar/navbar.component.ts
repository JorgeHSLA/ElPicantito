import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule], // Asegurar que RouterModule esté aquí
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  isLoggedIn = signal(false);
  isAdmin = signal(false);
  userName = signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Effect para reaccionar a cambios en el usuario logueado
    effect(() => {
      const user = this.authService.loggedUser();
      this.isLoggedIn.set(!!user);
      this.isAdmin.set(this.authService.isAdmin());
      this.userName.set(user?.nombreUsuario?.toString() || '');
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}