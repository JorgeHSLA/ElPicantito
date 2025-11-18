export interface Producto {
  id?: number;
  nombre?: string;
  descripcion?: string;
  precioDeVenta?: number;
  precioDeAdquisicion?: number;
  imagen?: string;
  disponible?: boolean;
  calificacion?: number;
  activo?: boolean;
  categoria?: 'PERSONALIZADO' | 'TACO' | 'BEBIDA' | 'ACOMPAÑAMIENTO' | 'POSTRE';
  
  // COMPATIBILIDAD HACIA ATRÁS - TEMPORAL
  precio?: number; // Mapea a precioDeVenta
}
