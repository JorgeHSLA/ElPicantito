import { Producto } from './producto';
import { Adicional } from './adicional';

export interface TacoPersonalizado {
  id?: number;
  nombre: string;
  tortilla: TipoTortilla | null;
  proteina: Producto | null;
  vegetales: AdicionalSeleccionado[];
  salsas: AdicionalSeleccionado[];
  quesos: AdicionalSeleccionado[];
  extras: AdicionalSeleccionado[];
  precioTotal: number;
  descripcion?: string;
}

export interface AdicionalSeleccionado {
  adicional: Adicional;
  cantidad: number;
}

export interface TipoTortilla {
  id: number;
  nombre: string;
  precio: number;
  descripcion?: string;
  imagen?: string;
}

export interface CategoriaAdicional {
  nombre: string;
  descripcion: string;
  icono: string;
  items: Adicional[];
  multipleSeleccion: boolean;
  obligatorio?: boolean;
}
