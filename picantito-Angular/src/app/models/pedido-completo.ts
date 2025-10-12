export interface PedidoProductoAdicional {
  adicionalId: number;
  nombreAdicional: string;
  cantidadAdicional: number;
  precio?: number; // Para calcular subtotales
}

export interface PedidoProducto {
  id: number;
  productoId: number;
  nombreProducto: string;
  cantidadProducto: number;
  precio?: number; // Para calcular subtotales
  adicionales: PedidoProductoAdicional[];
}

export interface PedidoCompleto {
  id: number;
  precioDeVenta: number;
  precioDeAdquisicion: number;
  fechaEntrega: string;
  fechaSolicitud: string;
  estado: string;
  direccion: string;
  clienteId: number;
  clienteNombre: string;
  repartidorId?: number;
  repartidorNombre?: string;
  productos: PedidoProducto[];
}

// Interface para crear un nuevo pedido
export interface CrearPedidoRequest {
  direccion: string;
  clienteId: number;
  fechaEntrega: string;
  productos: {
    productoId: number;
    cantidadProducto: number;
    adicionales?: {
      adicionalId: number;
      cantidadAdicional: number;
    }[];
  }[];
}