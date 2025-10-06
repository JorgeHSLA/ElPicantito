import { Component, OnInit, signal } from '@angular/core';
import { ProductoService } from '../../../services/tienda/producto.service';
import { AdicionalService } from '../../../services/tienda/adicional.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminNavbarComponent } from '../../shared/admin-navbar/admin-navbar.component';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component';

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

  constructor(
    private productoService: ProductoService,
    private adicionalService: AdicionalService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Productos
    this.productoService.getAllProductos().subscribe(productos => {
      this.totalProductos.set(productos.length);
    });
    // Adicionales
    this.adicionalService.getAllAdicionales().subscribe(adicionales => {
      this.totalAdicionales.set(adicionales.length);
    });
    // Usuarios
    this.authService.getAllUsuarios().subscribe(usuarios => {
      this.totalUsuarios.set(usuarios.length);
    });
  }
}
