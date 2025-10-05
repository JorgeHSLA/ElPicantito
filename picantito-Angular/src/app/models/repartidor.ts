
import { Usuario } from './usuario';

export class Repartidor implements Usuario {
  id?: number;
  nombreCompleto?: string;
  nombreUsuario?: string;
  telefono?: string;
  correo?: string;
  contrasenia?: string;
  rol?: string;
  estado?: string;
  activo?: boolean;
  pedidosRepartidor?: any[];
}
