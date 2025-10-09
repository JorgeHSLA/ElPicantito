export interface ProductoAdicional {
  id?: number;
  productoId?: number;
  adicionalId?: number;
  
  // Relaciones - pueden incluirse en respuestas del backend
  producto?: {
    id?: number;
    nombre?: string;
    descripcion?: string;
    precioDeVenta?: number;
    imagen?: string;
    disponible?: boolean;
    activo?: boolean;
  };
  
  adicional?: {
    id?: number;
    nombre?: string;
    descripcion?: string;
    precioDeVenta?: number;
    disponible?: boolean;
    activo?: boolean;
  };
}