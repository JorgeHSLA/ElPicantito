export interface Adicional {
  id?: number;
  nombre?: string;
  descripcion?: string;
  precioDeVenta?: number;
  precioDeAdquisicion?: number;
  cantidad?: number;
  disponible?: boolean;
  activo?: boolean;
  imagen?: string;
  categoria?: 'PROTEINA' | 'VEGETAL' | 'SALSA' | 'QUESO' | 'EXTRA';

  // COMPATIBILIDAD HACIA ATRÁS - TEMPORAL
  precio?: number; // Mapea a precioDeVenta
}
