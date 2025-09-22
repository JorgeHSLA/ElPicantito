import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminNavbarComponent } from '../../shared/admin-navbar/admin-navbar';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminNavbarComponent, AdminSidebarComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  totalProductos = signal(0);
  totalUsuarios = signal(0);
  totalAdicionales = signal(0);

  ngOnInit() {
    // Aquí llamarías a los servicios para obtener los datos reales
    this.totalProductos.set(15);
    this.totalUsuarios.set(8);
    this.totalAdicionales.set(5);
  }
}
