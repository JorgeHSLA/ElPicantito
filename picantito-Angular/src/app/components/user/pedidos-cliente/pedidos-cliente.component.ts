import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PedidoRestService, PedidoDto } from '../../../services/tienda/pedido-rest.service';
import { PedidoManagerService } from '../../../services/tienda/pedido-manager.service';
import { AuthService } from '../../../services/auth.service';
import { PedidoCompleto } from '../../../models/pedido-completo';

@Component({
  selector: 'app-pedidos-cliente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedidos-cliente.component.html',
  styleUrls: ['./pedidos-cliente.component.css']
})
export class PedidosClienteComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pedidoService = inject(PedidoRestService);
  private pedidoManager = inject(PedidoManagerService);
  private authService = inject(AuthService);

  pedidos = signal<PedidoCompleto[]>([]);
  loading = signal<boolean>(true);
  error = signal<string>('');

  ngOnInit(): void {
    // Verificar autenticación
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Obtener usuario actual en lugar de usar parámetro de ruta
    const usuario = this.authService.loggedUser();
    if (!usuario || !usuario.id) {
      this.error.set('Usuario no válido');
      this.loading.set(false);
      return;
    }

    // Cargar pedidos del cliente usando el nuevo servicio
    this.pedidoManager.getPedidosDelCliente().subscribe({
      next: (data) => {
        this.pedidos.set(data || []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando pedidos:', err);
        this.error.set('No se pudieron cargar los pedidos');
        this.loading.set(false);
      }
    });
  }

  // ==================== MÉTODOS DE UTILIDAD ====================

  formatearFecha(fecha: string): string {
    return this.pedidoManager.formatearFecha(fecha);
  }

  formatearMoneda(valor: number): string {
    return this.pedidoManager.formatearMoneda(valor);
  }

  // ==================== MÉTODOS DE ACCIÓN ====================

  verDetalles(pedidoId: number): void {
    this.router.navigate(['/pedido-detalle', pedidoId]);
  }

  cancelarPedido(pedidoId: number): void {
    const confirmar = confirm('¿Estás seguro de que quieres cancelar este pedido?');
    if (!confirmar) return;

    this.pedidoManager.cancelarPedido(pedidoId).subscribe({
      next: (pedidoCancelado) => {
        // Actualizar la lista de pedidos
        const pedidosActuales = this.pedidos();
        const index = pedidosActuales.findIndex(p => p.id === pedidoId);
        if (index !== -1) {
          pedidosActuales[index] = pedidoCancelado;
          this.pedidos.set([...pedidosActuales]);
        }
        alert('Pedido cancelado exitosamente');
      },
      error: (error) => {
        console.error('Error al cancelar pedido:', error);
        alert('No se pudo cancelar el pedido. Intenta nuevamente.');
      }
    });
  }

  reordenar(pedido: PedidoCompleto): void {
    // Implementar lógica para reordenar (agregar productos al carrito)
    console.log('Reordenar pedido:', pedido);
    // TODO: Implementar funcionalidad de reordenar
    alert('Funcionalidad de reordenar en desarrollo');
  }

  getPedidosPorEstado(estado: string): PedidoCompleto[] {
    return this.pedidos().filter(pedido => pedido.estado === estado);
  }

  getEstadoClass(estado: string): string {
    switch (estado.toUpperCase()) {
      case 'PENDIENTE': return 'badge bg-warning text-dark';
      case 'PREPARANDO': return 'badge bg-info';
      case 'EN_CAMINO': return 'badge bg-primary';
      case 'ENTREGADO': return 'badge bg-success';
      case 'CANCELADO': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }

  puedeSerCancelado(pedido: PedidoCompleto): boolean {
    return ['PENDIENTE', 'PREPARANDO'].includes(pedido.estado.toUpperCase());
  }

  calcularSubtotalProducto(producto: any): number {
    if (!producto.precioProducto) return 0;
    
    let subtotal = producto.precioProducto * producto.cantidadProducto;
    
    // Agregar precio de adicionales
    if (producto.adicionales && producto.adicionales.length > 0) {
      for (const adicional of producto.adicionales) {
        if (adicional.precioAdicional) {
          subtotal += adicional.precioAdicional * adicional.cantidadAdicional;
        }
      }
    }
    
    return subtotal;
  }
}
