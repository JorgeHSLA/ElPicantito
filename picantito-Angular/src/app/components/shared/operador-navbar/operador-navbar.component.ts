import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

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
    private router: Router
  ) {
    const user = this.authService.loggedUser();
    this.userName.set(user?.nombreUsuario?.toString() || 'Operador');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
