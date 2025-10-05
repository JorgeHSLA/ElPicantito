// Archivo temporal para mapear propiedades durante la migración a API REST
import { Producto } from '../models/producto';
import { Adicional } from '../models/adicional';

// Extender temporalmente las interfaces para incluir precio
export interface ProductoWithPrecio extends Producto {
  precio?: number;
}

export interface AdicionalWithPrecio extends Adicional {
  precio?: number;
}

// Funciones de mapeo
export function mapProductoToPrecio(producto: Producto): ProductoWithPrecio {
  return {
    ...producto,
    precio: producto.precioDeVenta // Mapear precioDeVenta -> precio
  };
}

export function mapAdicionalToPrecio(adicional: Adicional): AdicionalWithPrecio {
  return {
    ...adicional,
    precio: adicional.precioDeVenta // Mapear precioDeVenta -> precio
  };
}

export function mapPrecioToProducto(producto: ProductoWithPrecio): Producto {
  const { precio, ...rest } = producto;
  return {
    ...rest,
    precioDeVenta: precio // Mapear precio -> precioDeVenta
  };
}

export function mapPrecioToAdicional(adicional: AdicionalWithPrecio): Adicional {
  const { precio, ...rest } = adicional;
  return {
    ...rest,
    precioDeVenta: precio // Mapear precio -> precioDeVenta
  };
}