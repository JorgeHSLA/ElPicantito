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
  pedidosFiltrados = signal<PedidoCompleto[]>([]);
  filtroActivo = signal<string>('TODOS');
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
        // Ordenar pedidos por ID descendente (más recientes primero)
        const pedidosOrdenados = [...(data || [])].sort((a, b) => (b.id || 0) - (a.id || 0));
        this.pedidos.set(pedidosOrdenados);
        this.pedidosFiltrados.set(pedidosOrdenados);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando pedidos:', err);
        this.error.set('No se pudieron cargar los pedidos');
        this.loading.set(false);
      }
    });
  }

  // ==================== MÉTODOS DE FILTRADO ====================

  filtrarPorEstado(estado: string): void {
    this.filtroActivo.set(estado);
    
    if (estado === 'TODOS') {
      this.pedidosFiltrados.set(this.pedidos());
    } else {
      const filtrados = this.pedidos().filter(p => 
        p.estado.toUpperCase() === estado.toUpperCase()
      );
      this.pedidosFiltrados.set(filtrados);
    }
  }

  contarPorEstado(estado: string): number {
    if (estado === 'TODOS') {
      return this.pedidos().length;
    }
    return this.pedidos().filter(p => 
      p.estado.toUpperCase() === estado.toUpperCase()
    ).length;
  }

  // ==================== MÉTODOS DE UTILIDAD ====================

  formatearFecha(fecha: string): string {
    return this.pedidoManager.formatearFecha(fecha);
  }

  formatearMoneda(valor: number): string {
    return this.pedidoManager.formatearMoneda(valor);
  }

  // ==================== MÉTODOS DE ACCIÓN ====================

  eliminarPedido(pedidoId: number): void {
    const confirmar = confirm('¿Estás seguro de que quieres eliminar este pedido? Esta acción no se puede deshacer.');
    if (!confirmar) return;

    this.loading.set(true);
    
    // Eliminar el pedido completamente
    this.pedidoService.eliminarPedido(pedidoId).subscribe({
      next: () => {
        // Eliminar el pedido de la lista local
        const pedidosActuales = this.pedidos().filter(p => p.id !== pedidoId);
        this.pedidos.set(pedidosActuales);
        
        // Actualizar los pedidos filtrados también
        const pedidosFiltradosActuales = this.pedidosFiltrados().filter(p => p.id !== pedidoId);
        this.pedidosFiltrados.set(pedidosFiltradosActuales);
        
        this.loading.set(false);
        alert('Pedido eliminado exitosamente');
      },
      error: (error) => {
        console.error('Error al eliminar pedido:', error);
        this.loading.set(false);
        const mensaje = error.error?.message || 'No se pudo eliminar el pedido. Intenta nuevamente.';
        alert(mensaje);
      }
    });
  }

  // ==================== MÉTODOS DE UTILIDAD DE VISTA ====================

  getEstadoClass(estado: string): string {
    switch (estado.toUpperCase()) {
      case 'RECIBIDO': return 'badge bg-info';
      case 'COCINANDO': return 'badge bg-warning text-dark';
      case 'ENVIADO': return 'badge bg-primary';
      case 'ENTREGADO': return 'badge bg-success';
      case 'CANCELADO': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }

  puedeSerEliminado(pedido: PedidoCompleto): boolean {
    const estado = pedido.estado.toUpperCase();
    // Solo se pueden eliminar pedidos que están RECIBIDOS
    return estado === 'RECIBIDO';
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
