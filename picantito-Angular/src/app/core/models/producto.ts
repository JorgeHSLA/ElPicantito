import { Adicional } from './adicional';

export interface Producto {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  calificacion: number;
  disponible: boolean;
  adicionales?: Adicional[];
}