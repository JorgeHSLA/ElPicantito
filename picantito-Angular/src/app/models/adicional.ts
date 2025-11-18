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
  categoria?: 'TORTILLA' | 'PROTEINA' | 'SALSA' | 'EXTRAS' | 'VEGETAL' | 'QUESO' | 'EXTRA';

  // COMPATIBILIDAD HACIA ATRÁS - TEMPORAL
  precio?: number; // Mapea a precioDeVenta
}
