import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GestionPedidosService } from '../../../services/gestion-pedidos.service';
import { RepartidorService } from '../../../services/repartidor.service';
import { PedidoCompleto } from '../../../models/pedido-completo';
import { Repartidor } from '../../../models/repartidor';

interface PedidosPorEstado {
  [key: string]: PedidoCompleto[];
  recibido: PedidoCompleto[];
  cocinando: PedidoCompleto[];
  enviado: PedidoCompleto[];
  entregado: PedidoCompleto[];
}

@Component({
  selector: 'app-gestion-pedidos',
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-pedidos.html',
  styleUrl: './gestion-pedidos.css'
})
export class GestionPedidos implements OnInit {
  private gestionPedidosService = inject(GestionPedidosService);
  private repartidorService = inject(RepartidorService);

  pedidos: PedidoCompleto[] = [];
  pedidosPorEstado: PedidosPorEstado = {
    recibido: [],
    cocinando: [],
    enviado: [],
    entregado: []
  };

  repartidoresDisponibles: Repartidor[] = [];
  todosRepartidores: Repartidor[] = [];
  repartidorSeleccionado: { [pedidoId: number]: number } = {};
  
  loading = false;
  error: string | null = null;
  successMessage: string | null = null;

  estadosOrdenados = ['recibido', 'cocinando', 'enviado', 'entregado'];
  
  estadosLabels: { [key: string]: string } = {
    'recibido': 'Recibido',
    'cocinando': 'Cocinando',
    'enviado': 'Enviado',
    'entregado': 'Entregado'
  };

  ngOnInit(): void {
    this.cargarPedidos();
    this.cargarRepartidores();
  }

  cargarPedidos(): void {
    this.loading = true;
    this.error = null;

    this.gestionPedidosService.getAllPedidos().subscribe({
      next: (pedidos) => {
        this.pedidos = pedidos;
        this.organizarPedidosPorEstado();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los pedidos';
        console.error('Error:', err);
        this.loading = false;
      }
    });
  }

  cargarRepartidores(): void {
    // Cargar todos los repartidores para mostrarlos con su estado
    this.repartidorService.getRepartidores().subscribe({
      next: (repartidores) => {
        this.todosRepartidores = repartidores;
        // También mantener la lista de solo disponibles para validaciones
        this.repartidoresDisponibles = repartidores.filter(r => r.estado === 'DISPONIBLE');
      },
      error: (err) => {
        console.error('Error al cargar repartidores:', err);
      }
    });
  }

  cargarRepartidoresDisponibles(): void {
    this.repartidorService.getRepartidoresDisponibles().subscribe({
      next: (repartidores) => {
        this.repartidoresDisponibles = repartidores;
      },
      error: (err) => {
        console.error('Error al cargar repartidores:', err);
      }
    });
  }

  organizarPedidosPorEstado(): void {
    this.pedidosPorEstado = {
      recibido: this.pedidos.filter(p => p.estado.toLowerCase() === 'recibido'),
      cocinando: this.pedidos.filter(p => p.estado.toLowerCase() === 'cocinando'),
      enviado: this.pedidos.filter(p => p.estado.toLowerCase() === 'enviado'),
      entregado: this.pedidos.filter(p => p.estado.toLowerCase() === 'entregado')
    };
  }

  avanzarEstado(pedido: PedidoCompleto): void {
    const estadoActual = pedido.estado.toLowerCase();
    const indiceActual = this.estadosOrdenados.indexOf(estadoActual);
    
    if (indiceActual === -1 || indiceActual >= this.estadosOrdenados.length - 1) {
      this.error = 'No se puede avanzar más el estado del pedido';
      return;
    }

    const nuevoEstado = this.estadosOrdenados[indiceActual + 1];

    // Si el nuevo estado es "enviado", verificar que tenga repartidor asignado
    if (nuevoEstado === 'enviado') {
      const repartidorId = this.repartidorSeleccionado[pedido.id];
      if (!repartidorId) {
        this.error = 'Debe seleccionar un repartidor antes de enviar el pedido';
        return;
      }
      
      // Primero asignar el repartidor
      this.asignarRepartidor(pedido.id, repartidorId, nuevoEstado);
    } else {
      // Para otros estados, solo actualizar el estado
      this.actualizarEstadoPedido(pedido.id, nuevoEstado);
    }
  }

  asignarRepartidor(pedidoId: number, repartidorId: number, nuevoEstado: string): void {
    this.loading = true;
    this.error = null;

    this.gestionPedidosService.asignarRepartidor({ pedidoId, repartidorId }).subscribe({
      next: () => {
        // Después de asignar, actualizar el estado
        this.actualizarEstadoPedido(pedidoId, nuevoEstado);
      },
      error: (err) => {
        this.error = err.error || 'Error al asignar repartidor';
        console.error('Error:', err);
        this.loading = false;
        
        // Limpiar mensaje de error después de 5 segundos
        setTimeout(() => {
          this.error = null;
        }, 5000);
      }
    });
  }

  actualizarEstadoPedido(pedidoId: number, nuevoEstado: string): void {
    this.loading = true;
    this.error = null;

    this.gestionPedidosService.actualizarEstado(pedidoId, nuevoEstado).subscribe({
      next: (pedidoActualizado) => {
        this.successMessage = `Pedido #${pedidoId} actualizado a ${this.estadosLabels[nuevoEstado]}`;
        
        // Actualizar el pedido en la lista local
        const index = this.pedidos.findIndex(p => p.id === pedidoId);
        if (index !== -1) {
          this.pedidos[index] = pedidoActualizado;
        }
        
        this.organizarPedidosPorEstado();
        
        // Recargar lista de repartidores para actualizar disponibilidad
        this.cargarRepartidores();
        
        this.loading = false;

        // Limpiar mensaje después de 3 segundos
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);

        // Si llegó a "enviado", recargar repartidores disponibles
        if (nuevoEstado === 'enviado') {
          this.cargarRepartidoresDisponibles();
        }
      },
      error: (err) => {
        this.error = 'Error al actualizar el estado del pedido';
        console.error('Error:', err);
        this.loading = false;
      }
    });
  }

  puedeAvanzar(estado: string): boolean {
    const indice = this.estadosOrdenados.indexOf(estado.toLowerCase());
    return indice !== -1 && indice < this.estadosOrdenados.length - 1;
  }

  getColorEstadoRepartidor(estado: string | undefined): string {
    if (!estado) return 'bg-secondary';
    
    switch (estado.toUpperCase()) {
      case 'DISPONIBLE':
        return 'bg-success';
      case 'OCUPADO':
        return 'bg-warning';
      case 'INACTIVO':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor);
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getColorEstado(estado: string): string {
    const colores: { [key: string]: string } = {
      'recibido': 'bg-info',
      'cocinando': 'bg-warning',
      'enviado': 'bg-primary',
      'entregado': 'bg-success'
    };
    return colores[estado.toLowerCase()] || 'bg-secondary';
  }
}
