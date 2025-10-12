import { Injectable, inject } from '@angular/core';
import { Observable, map, catchError, throwError } from 'rxjs';
import { CarritoService } from '../carrito.service';
import { PedidoRestService } from './pedido-rest.service';
import { AuthService } from '../auth.service';
import { PedidoCompleto, CrearPedidoRequest } from '../../models/pedido-completo';
import { CartSummary } from '../../models/cart-item';

@Injectable({
  providedIn: 'root'
})
export class PedidoManagerService {
  private carritoService = inject(CarritoService);
  private pedidoRestService = inject(PedidoRestService);
  private authService = inject(AuthService);

  /**
   * Procesar pedido desde el carrito actual
   */
  procesarPedidoDesdeCarrito(direccion: string, fechaEntrega?: string): Observable<PedidoCompleto> {
    const summary = this.carritoService.getCartSummary();
    
    if (summary.items.length === 0) {
      return throwError(() => new Error('El carrito está vacío'));
    }

    const usuario = this.authService.loggedUser();
    if (!usuario || !usuario.id) {
      return throwError(() => new Error('Usuario no autenticado'));
    }

    // Convertir items del carrito a formato de pedido
    const productos = summary.items.map(item => ({
      productoId: item.producto.id!,
      cantidadProducto: item.cantidad,
      adicionales: item.adicionales.map(adicional => ({
        adicionalId: adicional.adicional.id!,
        cantidadAdicional: adicional.cantidad
      }))
    }));

    const pedidoRequest: CrearPedidoRequest = {
      direccion,
      clienteId: usuario.id,
      fechaEntrega: fechaEntrega || this.getDefaultFechaEntrega(),
      productos
    };

    return this.pedidoRestService.crearPedido(pedidoRequest).pipe(
      map(pedidoCreado => {
        // Limpiar carrito después de crear el pedido exitosamente
        this.carritoService.limpiarCarritoCompleto();
        return pedidoCreado;
      }),
      catchError(error => {
        console.error('Error al procesar pedido:', error);
        return throwError(() => new Error('Error al procesar el pedido. Intente nuevamente.'));
      })
    );
  }

  /**
   * Obtener pedidos del cliente actual
   */
  getPedidosDelCliente(): Observable<PedidoCompleto[]> {
    const usuario = this.authService.loggedUser();
    if (!usuario || !usuario.id) {
      return throwError(() => new Error('Usuario no autenticado'));
    }

    return this.pedidoRestService.getByCliente(usuario.id).pipe(
      // Convertir PedidoDto[] a PedidoCompleto[]
      map(pedidosDto => {
        // Si el backend ya retorna PedidoCompleto, hacer cast directo
        return pedidosDto as unknown as PedidoCompleto[];
      }),
      catchError(error => {
        console.error('Error al obtener pedidos del cliente:', error);
        return throwError(() => new Error('Error al cargar los pedidos'));
      })
    );
  }

  /**
   * Obtener detalles de un pedido específico
   */
  getDetallePedido(pedidoId: number): Observable<PedidoCompleto> {
    return this.pedidoRestService.getPedidoById(pedidoId).pipe(
      catchError(error => {
        console.error('Error al obtener detalles del pedido:', error);
        return throwError(() => new Error('Error al cargar los detalles del pedido'));
      })
    );
  }

  /**
   * Cancelar pedido (solo si está en estado PENDIENTE)
   */
  cancelarPedido(pedidoId: number): Observable<PedidoCompleto> {
    return this.pedidoRestService.cambiarEstadoPedido(pedidoId, 'CANCELADO').pipe(
      catchError(error => {
        console.error('Error al cancelar pedido:', error);
        return throwError(() => new Error('No se pudo cancelar el pedido'));
      })
    );
  }

  /**
   * Validar si se puede procesar un pedido
   */
  validarPedido(summary: CartSummary): { valido: boolean; errores: string[] } {
    const errores: string[] = [];

    if (summary.items.length === 0) {
      errores.push('El carrito está vacío');
    }

    if (summary.total <= 0) {
      errores.push('El total del pedido debe ser mayor a $0');
    }

    // Validar que todos los productos tengan información completa
    for (const item of summary.items) {
      if (!item.producto.id) {
        errores.push(`Producto sin ID: ${item.producto.nombre}`);
      }
      
      if (item.cantidad <= 0) {
        errores.push(`Cantidad inválida para: ${item.producto.nombre}`);
      }

      // Validar adicionales
      for (const adicional of item.adicionales) {
        if (!adicional.adicional.id) {
          errores.push(`Adicional sin ID: ${adicional.adicional.nombre}`);
        }
        
        if (adicional.cantidad <= 0) {
          errores.push(`Cantidad inválida para adicional: ${adicional.adicional.nombre}`);
        }
      }
    }

    const usuario = this.authService.loggedUser();
    if (!usuario || !usuario.id) {
      errores.push('Debe iniciar sesión para realizar un pedido');
    }

    return {
      valido: errores.length === 0,
      errores
    };
  }

  /**
   * Calcular fecha de entrega por defecto (ejemplo: 1 hora desde ahora)
   */
  private getDefaultFechaEntrega(): string {
    const ahora = new Date();
    const fechaEntrega = new Date(ahora.getTime() + 60 * 60 * 1000); // 1 hora después
    return fechaEntrega.toISOString();
  }

  /**
   * Formatear moneda
   */
  formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(valor);
  }

  /**
   * Formatear fecha
   */
  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}