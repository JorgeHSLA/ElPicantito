import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="position-sticky top-0 z-3">
      <nav class="navbar navbar-expand-lg navBarExtra shadow-sm admin-navbar">
        <div class="container d-flex justify-content-between align-items-center">
          <!-- Logo izquierdo -->
          <a class="navbar-brand d-flex align-items-center" routerLink="/admin/dashboard">
            <img src="/images/LogoFont.png" alt="El Picantito Logo" width="200" height="120" class="me-2" />
          </a>
          
          <!-- Panel central -->
          <div class="d-flex align-items-center mx-auto admin-title">
            <img src="/images/LogoMinimalist.png" alt="Logo" width="40" height="40" class="me-2" />
            <span class="fw-bold text-light fs-4">Administración</span>
            <img src="/images/LogoMinimalist.png" alt="Logo" width="40" height="40" class="ms-2" />
          </div>
          
          <!-- Dropdown usuario -->
          <div class="d-flex align-items-center ms-auto">
            <ul class="navbar-nav flex-row">
              <li class="nav-item dropdown">
                <a class="nav-link icon-nav dropdown-toggle" href="#" id="adminUserDropdown" 
                   role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="bi bi-person-gear fs-5"></i>
                </a>
                <ul class="dropdown-menu dropdown-menu-end user-dropdown-menu" 
                    aria-labelledby="adminUserDropdown">
                  <li class="dropdown-header">
                    <img src="/images/LogoMinimalistBlackWhite.png" alt="Logo" 
                         style="width:45px;height:45px;object-fit:contain;margin-right:8px;">
                    <span>{{ userName() }}</span>
                  </li>
                  <li><hr class="dropdown-divider"></li>
                  <li>
                    <a class="dropdown-item user-dropdown-item" routerLink="/tienda">
                      <i class="bi bi-shop me-2"></i>Ver Tienda
                    </a>
                  </li>
                  <li><hr class="dropdown-divider"></li>
                  <li>
                    <a class="dropdown-item user-dropdown-item logout-item" 
                       href="#" (click)="logout(); $event.preventDefault()">
                      <i class="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  `,
  styles: [`
    .admin-navbar {
      background-color: #212529 !important;
      border-bottom: 2px solid #343a40;
    }
    
    .admin-title {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      letter-spacing: 1px;
    }
    
    .icon-nav {
      color: #f8f9fa !important;
    }
  `]
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

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
