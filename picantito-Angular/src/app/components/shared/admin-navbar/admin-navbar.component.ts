import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-navbar.html',
  styleUrls: ['./admin-navbar.css']
})
export class AdminNavbarComponent {
  userName = signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    const user = this.authService.loggedUser();
    this.userName.set(user?.nombreUsuario?.toString() || 'Admin');
  }

  // Search removed — title displayed instead of search input.

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
