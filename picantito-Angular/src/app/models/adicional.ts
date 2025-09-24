import { Producto } from './producto';

export interface Adicional {
  id?: number;
  nombre?: string;
  descripcion?: string;
  precio?: number;
  precioDeAdquisicion?: number; // Agregar esta propiedad que faltaba
  cantidad?: number; // Agregar esta propiedad también
  disponible?: boolean;
  productos?: Producto[];
}
