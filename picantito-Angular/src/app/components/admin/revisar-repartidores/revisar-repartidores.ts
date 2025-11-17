import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminNavbarComponent } from '../../shared/admin-navbar/admin-navbar.component';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component';
import { PedidoCompleto } from '../../../models/pedido-completo';
import { Repartidor } from '../../../models/repartidor';
import { GestionPedidosService } from '../../../services/gestion-pedidos.service';
import { RepartidorService } from '../../../services/repartidor.service';

@Component({
  selector: 'app-revisar-repartidores',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AdminNavbarComponent, AdminSidebarComponent],
  templateUrl: './revisar-repartidores.html',
  styleUrl: './revisar-repartidores.css'
})
export class RevisarRepartidoresComponent implements OnInit {
  private gestionPedidos = inject(GestionPedidosService);
  private repartidorService = inject(RepartidorService);

  pedidosActivos = signal<PedidoCompleto[]>([]);
  pedidosFiltrados = signal<PedidoCompleto[]>([]);
  repartidoresActivos = signal<Repartidor[]>([]);
  
  // Filtros y búsqueda
  searchTerm = signal('');
  filtroEstado = signal('todos'); // 'todos', 'recibido', 'cocinando', 'enviado', 'entregado'
  filtroRepartidor = signal('todos');
  filtroOrden = signal('id-desc');
  
  loading = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');

  // Selección de repartidor por pedido
  repartidorSeleccionado: { [pedidoId: number]: number } = {};

  // Orden de estados como en Operador
  private estadosOrdenados = ['recibido', 'cocinando', 'enviado', 'entregado'];

  ngOnInit(): void {
    // Cargar datos al entrar a la vista
    this.cargarDatos();
  }

  // Utils repartidor
  isRepartidorInactivo(rep?: Repartidor | null): boolean {
    if (!rep) return false;
    return (rep.estado || '').toUpperCase() === 'INACTIVO' || rep.activo === false;
  }

  getRepartidorById(id?: number): Repartidor | undefined {
    if (!id) return undefined;
    return this.repartidoresActivos().find(r => r.id === id);
  }

  private cargarDatos(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    // Cargar todos los pedidos exactamente como en la pantalla de Operador
    this.gestionPedidos.getAllPedidos().subscribe({
      next: (pedidos) => {
        this.pedidosActivos.set(pedidos || []);
        this.aplicarFiltros();
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando pedidos:', err);
        this.errorMessage.set('No se pudieron cargar los pedidos activos');
        this.loading.set(false);
      }
    });

    // Cargar repartidores con rol REPARTIDOR; el servicio ya filtra por query params
    this.repartidorService.getRepartidores().subscribe({
      next: (rep) => {
        // Seguridad adicional: filtrar por rol === 'REPARTIDOR' por si el backend devuelve extra
        const soloRepartidores = (rep || []).filter(r => (r as any).rol?.toUpperCase?.() === 'REPARTIDOR');
        this.repartidoresActivos.set(soloRepartidores);
      },
      error: (err) => {
        console.error('Error cargando repartidores:', err);
        this.errorMessage.set('No se pudieron cargar los repartidores activos');
      }
    });
  }

  aplicarFiltros() {
    let resultado = [...this.pedidosActivos()];
    
    const termino = this.searchTerm().toLowerCase();
    if (termino) {
      resultado = resultado.filter(p => 
        p.id?.toString().includes(termino) ||
        p.clienteNombre?.toLowerCase().includes(termino) ||
        p.direccion?.toLowerCase().includes(termino)
      );
    }
    
    const estado = this.filtroEstado();
    if (estado !== 'todos') {
      resultado = resultado.filter(p => p.estado?.toLowerCase() === estado);
    }
    
    const repartidor = this.filtroRepartidor();
    if (repartidor !== 'todos') {
      const repId = parseInt(repartidor);
      resultado = resultado.filter(p => p.repartidorId === repId);
    }
    
    const orden = this.filtroOrden();
    switch(orden) {
      case 'id-asc':
        resultado.sort((a, b) => a.id - b.id);
        break;
      case 'id-desc':
        resultado.sort((a, b) => b.id - a.id);
        break;
      case 'fecha-asc':
        resultado.sort((a, b) => new Date(a.fechaSolicitud || '').getTime() - new Date(b.fechaSolicitud || '').getTime());
        break;
      case 'fecha-desc':
        resultado.sort((a, b) => new Date(b.fechaSolicitud || '').getTime() - new Date(a.fechaSolicitud || '').getTime());
        break;
    }
    
    this.pedidosFiltrados.set(resultado);
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
    this.aplicarFiltros();
  }

  onFiltroEstadoChange(value: string) {
    this.filtroEstado.set(value);
    this.aplicarFiltros();
  }

  onFiltroRepartidorChange(value: string) {
    this.filtroRepartidor.set(value);
    this.aplicarFiltros();
  }

  onFiltroOrdenChange(value: string) {
    this.filtroOrden.set(value);
    this.aplicarFiltros();
  }

  limpiarFiltros() {
    this.searchTerm.set('');
    this.filtroEstado.set('todos');
    this.filtroRepartidor.set('todos');
    this.filtroOrden.set('id-desc');
    this.aplicarFiltros();
  }

  // Helpers de estado
  private getSiguienteEstado(estadoActual: string): string | null {
    const idx = this.estadosOrdenados.indexOf((estadoActual || '').toLowerCase());
    if (idx === -1 || idx >= this.estadosOrdenados.length - 1) return null;
    return this.estadosOrdenados[idx + 1];
  }

  puedeAvanzar(estado: string | undefined): boolean {
    if (!estado) return false;
    const idx = this.estadosOrdenados.indexOf(estado.toLowerCase());
    return idx !== -1 && idx < this.estadosOrdenados.length - 1;
  }

  // Expuesto para template: ¿el siguiente estado es 'enviado'?
  nextIsEnviado(estado: string | undefined): boolean {
    const siguiente = this.getSiguienteEstado(estado || '');
    return siguiente === 'enviado';
  }

  // Id de repartidor seleccionado o el ya asignado al pedido
  getRepartidorIdParaPedido(pedido: PedidoCompleto): number | undefined {
    return this.repartidorSeleccionado[pedido.id] !== undefined
      ? this.repartidorSeleccionado[pedido.id]
      : pedido.repartidorId;
  }

  // Bloquear avanzar si el siguiente es 'enviado' y el repartidor está INACTIVO
  isBloqueadoAvanzar(pedido: PedidoCompleto): boolean {
    if (!this.nextIsEnviado(pedido.estado)) return false;
    const repId = this.getRepartidorIdParaPedido(pedido);
    if (!repId) return false; // la falta de selección se maneja con mensaje al hacer clic
    const rep = this.getRepartidorById(repId);
    return this.isRepartidorInactivo(rep);
  }

  // Deshabilitar botón Asignar si el seleccionado está INACTIVO
  isAsignarDisabled(pedidoId: number): boolean {
    const repId = this.repartidorSeleccionado[pedidoId];
    const rep = this.getRepartidorById(repId);
    return this.isRepartidorInactivo(rep);
  }

  // Acciones
  avanzarEstado(pedido: PedidoCompleto): void {
    const siguiente = this.getSiguienteEstado(pedido.estado);
    if (!siguiente) return;

    // Si va a 'enviado' verificar repartidor seleccionado
    if (siguiente === 'enviado') {
      const repId = this.repartidorSeleccionado[pedido.id] ?? pedido.repartidorId;
      if (!repId) {
        this.errorMessage.set('Debe seleccionar un repartidor antes de enviar el pedido');
        setTimeout(() => this.errorMessage.set(''), 4000);
        return;
      }

      // Validar que el repartidor no esté INACTIVO
      const rep = this.getRepartidorById(repId);
      if (this.isRepartidorInactivo(rep)) {
        this.errorMessage.set('El repartidor seleccionado está INACTIVO y no puede ser asignado');
        setTimeout(() => this.errorMessage.set(''), 4000);
        return;
      }

      // Asignar y luego actualizar estado
      this.asignarRepartidorInterno(pedido.id, repId, () => this.actualizarEstadoInterno(pedido.id, siguiente));
    } else {
      this.actualizarEstadoInterno(pedido.id, siguiente);
    }
  }

  asignarRepartidorDirecto(pedidoId: number): void {
    const repId = this.repartidorSeleccionado[pedidoId];
    if (!repId) {
      this.errorMessage.set('Seleccione un repartidor para asignar');
      setTimeout(() => this.errorMessage.set(''), 3000);
      return;
    }
    // Validar estado del repartidor
    const rep = this.getRepartidorById(repId);
    if (this.isRepartidorInactivo(rep)) {
      this.errorMessage.set('No se puede asignar un repartidor INACTIVO');
      setTimeout(() => this.errorMessage.set(''), 3000);
      return;
    }
    this.asignarRepartidorInterno(pedidoId, repId, () => {
      this.successMessage.set(`Repartidor asignado al pedido #${pedidoId}`);
      setTimeout(() => this.successMessage.set(''), 2500);
      this.cargarDatos();
    });
  }

  private asignarRepartidorInterno(pedidoId: number, repartidorId: number, onSuccess?: () => void): void {
    this.loading.set(true);
    this.gestionPedidos.asignarRepartidor({ pedidoId, repartidorId }).subscribe({
      next: () => {
        this.loading.set(false);
        if (onSuccess) onSuccess();
      },
      error: (err) => {
        console.error('Error al asignar repartidor', err);
        this.errorMessage.set(err?.error || 'Error al asignar repartidor');
        this.loading.set(false);
      }
    });
  }

  private actualizarEstadoInterno(pedidoId: number, nuevoEstado: string): void {
    this.loading.set(true);
    this.gestionPedidos.actualizarEstado(pedidoId, nuevoEstado).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set(`Pedido #${pedidoId} actualizado a ${nuevoEstado.toUpperCase()}`);
        setTimeout(() => this.successMessage.set(''), 2500);
        this.cargarDatos();
      },
      error: (err) => {
        console.error('Error al actualizar estado', err);
        this.errorMessage.set('Error al actualizar el estado del pedido');
        this.loading.set(false);
      }
    });
  }

  // Activar / Desactivar repartidor (cambia estado en la BD)
  activarRepartidor(id: number): void {
    this.cambiarEstadoRepartidor(id, 'DISPONIBLE');
  }

  desactivarRepartidor(id: number): void {
    this.cambiarEstadoRepartidor(id, 'INACTIVO');
  }

  private cambiarEstadoRepartidor(id: number, estado: string): void {
    this.loading.set(true);
    this.repartidorService.cambiarEstadoRepartidor(id, estado).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set(`Repartidor #${id} cambiado a ${estado}`);
        setTimeout(() => this.successMessage.set(''), 2500);
        // Recargar repartidores y pedidos (por si cambian reglas de asignación)
        this.cargarDatos();
      },
      error: (err) => {
        console.error('Error cambiando estado del repartidor', err);
        this.errorMessage.set('No se pudo cambiar el estado del repartidor');
        this.loading.set(false);
      }
    });
  }
}
