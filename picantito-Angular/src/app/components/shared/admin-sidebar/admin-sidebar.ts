import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
      <div class="position-sticky pt-3">
        <ul class="nav flex-column">
          <li class="nav-item">
            <a class="nav-link" routerLink="/admin/dashboard" 
               routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              <i class="bi bi-speedometer2 me-2"></i>Dashboard
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" routerLink="/admin/productos" 
               routerLinkActive="active">
              <i class="bi bi-box me-2"></i>Productos
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" routerLink="/admin/adicionales" 
               routerLinkActive="active">
              <i class="bi bi-plus-circle me-2"></i>Adicionales
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" routerLink="/admin/usuarios" 
               routerLinkActive="active">
              <i class="bi bi-people me-2"></i>Usuarios
            </a>
          </li>
        </ul>
      </div>
    </nav>
  `,
  styles: [`
    .sidebar {
      background-color: var(--neutral-surface);
      border-right: 2px solid var(--neutral-border);
      min-height: calc(100vh - 70px);
    }

    .sidebar .nav-link {
      color: var(--neutral-text);
      padding: 0.75rem 1rem;
      border-radius: 8px;
      margin: 0.25rem 0;
      transition: all 0.3s ease;
    }

    .sidebar .nav-link:hover {
      background-color: var(--primary-light);
      color: var(--primary-hover);
      transform: translateX(5px);
    }

    .sidebar .nav-link.active {
      background-color: var(--primary-color);
      color: white;
    }
  `]
})
export class AdminSidebarComponent {
  @Input() activeRoute: string = '';
}
