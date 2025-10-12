import { Producto } from './producto';
import { Adicional } from './adicional';

// Interface para un adicional seleccionado en el carrito
export interface AdicionalSeleccionado {
  adicional: Adicional;
  cantidad: number;
  subtotal: number;
}

// Interface para un item del carrito con adicionales
export interface CartItem {
  id: string; // ID único para el item del carrito (producto + adicionales únicos)
  producto: Producto;
  cantidad: number;
  adicionales: AdicionalSeleccionado[];
  subtotal: number; // Total incluyendo adicionales
}

// Interface para el resumen del carrito
export interface CartSummary {
  items: CartItem[];
  cantidadTotal: number;
  subtotalProductos: number;
  subtotalAdicionales: number;
  total: number;
}