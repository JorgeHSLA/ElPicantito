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
      padding: 10px;
      border-radius: 50%;
      margin: 0 2px;
      text-decoration: none;
      transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
    }
    
    .icon-nav:hover {
      color: var(--accent-color) !important;
      transform: translateY(-2px) scale(1.1);
      background-color: rgba(255, 255, 255, 0.15);
    }
    
    .user-dropdown-menu {
      border: none;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      padding: 0;
      margin-top: 10px;
      min-width: 220px;
      background: var(--neutral-bg);
      overflow: hidden;
      animation: dropdownFadeIn 0.3s ease-out;
    }
    
    .user-dropdown-menu .dropdown-header {
      background: var(--accent-hover);
      color: var(--neutral-text);
      font-weight: 600;
      font-size: 0.9rem;
      padding: 1rem;
      margin: 0;
      border-radius: 15px 15px 0 0;
      display: flex;
      align-items: center;
      text-transform: none;
      border: none;
    }
    
    .user-dropdown-menu .dropdown-header span {
      color: white !important;
    }
    
    .user-dropdown-item {
      padding: 0.75rem 1rem;
      color: var(--neutral-text);
      font-weight: 500;
      transition: background 0.3s, color 0.3s;
      border: none;
      display: flex;
      align-items: center;
      position: relative;
      overflow: hidden;
      text-decoration: none;
    }
    
    .user-dropdown-item:hover {
      background: linear-gradient(135deg, var(--primary-light), rgba(255, 193, 7, 0.1));
      color: var(--primary-hover);
      box-shadow: inset 3px 0 0 var(--primary-color);
      text-decoration: none;
    }
    
    .logout-item:hover {
      background: linear-gradient(135deg, rgba(244, 67, 54, 0.1), rgba(244, 67, 54, 0.05));
      color: #e53e3e;
      box-shadow: inset 3px 0 0 #e53e3e;
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