import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GestionPedidosService } from '../../../services/gestion-pedidos.service';
import { RepartidorService } from '../../../services/repartidor.service';
import { PedidoCompleto } from '../../../models/pedido-completo';
import { OperadorNavbarComponent } from '../../shared/operador-navbar/operador-navbar.component';
import { OperadorSidebarComponent } from '../../shared/operador-sidebar/operador-sidebar.component';

@Component({
  selector: 'app-dashboard-operador',
  imports: [CommonModule, RouterLink, OperadorNavbarComponent, OperadorSidebarComponent],
  templateUrl: './dashboard-operador.html',
  styleUrl: './dashboard-operador.css'
})
export class DashboardOperador implements OnInit {
  private gestionPedidosService = inject(GestionPedidosService);
  private repartidorService = inject(RepartidorService);

  pedidos: PedidoCompleto[] = [];
  estadisticas = {
    recibidos: 0,
    cocinando: 0,
    enviados: 0,
    entregados: 0,
    total: 0,
    repartidoresDisponibles: 0
  };

  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
    this.loading = true;
    this.error = null;

    // Cargar pedidos
    this.gestionPedidosService.getAllPedidos().subscribe({
      next: (pedidos) => {
        this.pedidos = pedidos;
        this.calcularEstadisticas();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las estadísticas';
        console.error('Error:', err);
        this.loading = false;
      }
    });

    // Cargar repartidores disponibles
    this.repartidorService.getRepartidoresDisponibles().subscribe({
      next: (repartidores) => {
        this.estadisticas.repartidoresDisponibles = repartidores.length;
      },
      error: (err) => {
        console.error('Error al cargar repartidores:', err);
      }
    });
  }

  calcularEstadisticas(): void {
    this.estadisticas.recibidos = this.pedidos.filter(
      p => p.estado.toLowerCase() === 'recibido'
    ).length;
    
    this.estadisticas.cocinando = this.pedidos.filter(
      p => p.estado.toLowerCase() === 'cocinando'
    ).length;
    
    this.estadisticas.enviados = this.pedidos.filter(
      p => p.estado.toLowerCase() === 'enviado'
    ).length;
    
    this.estadisticas.entregados = this.pedidos.filter(
      p => p.estado.toLowerCase() === 'entregado'
    ).length;
    
    this.estadisticas.total = this.pedidos.length;
  }
}
