export interface Usuario {
  id?: number;
  nombreCompleto?: string;
  nombreUsuario?: string;
  telefono?: string;
  correo?: string;
  contrasenia?: string;
  password?: string;
  rol?: string;
  estado?: string;
  activo?: boolean;
  fechaRegistro?: string;
  pedidosRealizados?: number;
}
