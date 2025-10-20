import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarOptionsComponent } from './sidebar-options.component';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarOptionsComponent],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.css'
})
export class AdminSidebarComponent {
  @Input() activeRoute: string = '';
  options = [
    { label: 'Dashboard', icon: 'bi bi-speedometer2 me-2', route: '/admin/dashboard' },
    { label: 'Productos', icon: 'bi bi-box me-2', route: '/admin/productos' },
    { label: 'Adicionales', icon: 'bi bi-plus-circle me-2', route: '/admin/adicionales' },
    { label: 'Usuarios', icon: 'bi bi-people me-2', route: '/admin/usuarios' },
    { label: 'Revisar repartidores', icon: 'bi bi-truck me-2', route: '/admin/revisar-repartidores' }
  ];
}