import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ProductoService } from '../services/tienda/producto.service';
import { AdicionalService } from '../services/tienda/adicional.service';
import { Usuario } from '../models/usuario';
import { Producto } from '../models/producto';
import { Adicional } from '../models/adicional';

@Component({
  selector: 'app-ejemplo-uso-api',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ejemplo-uso-api.component.html'
})
export class EjemploUsoApiComponent implements OnInit {
  loginData = { nombreUsuario: '', contrasenia: '' };
  productos: Producto[] = [];
  adicionales: Adicional[] = [];

  constructor(
    public authService: AuthService,
    private productoService: ProductoService,
    private adicionalService: AdicionalService
  ) {}

  ngOnInit() {
    // Código de inicialización si es necesario
  }

  login() {
    this.authService.login(this.loginData.nombreUsuario, this.loginData.contrasenia)
      .subscribe({
        next: (success) => {
          if (success) {
            console.log('Login exitoso');
          } else {
            console.log('Login falló');
          }
        },
        error: (error) => {
          console.error('Error en login:', error);
        }
      });
  }

  cargarProductos() {
    this.productoService.getAllProductos().subscribe({
      next: (productos) => {
        this.productos = productos;
        console.log('Productos cargados:', productos);
      },
      error: (error) => {
        console.error('Error cargando productos:', error);
      }
    });
  }

  cargarAdicionales() {
    this.adicionalService.getAllAdicionales().subscribe({
      next: (adicionales) => {
        this.adicionales = adicionales;
        console.log('Adicionales cargados:', adicionales);
      },
      error: (error) => {
        console.error('Error cargando adicionales:', error);
      }
    });
  }
}