import { Usuario } from './usuario';

export class Cliente implements Usuario {
  id?: number;
  nombreCompleto?: string;
  nombreUsuario?: string;
  telefono?: string;
  correo?: string;
  contrasenia?: string;
  rol?: string;
  estado?: string;
  activo?: boolean;
  pedidosCliente?: any[];
}
