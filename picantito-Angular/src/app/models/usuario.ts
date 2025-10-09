export interface Usuario {
  id?: number;
  nombreCompleto?: string;
  nombreUsuario?: string;
  telefono?: string;
  correo?: string;
  contrasenia?: string;
  password?: string;
  rol?: string;
  estado?: string | null; // Permitir null para usuarios normales
  activo?: boolean;
  fechaRegistro?: string;
  pedidosRealizados?: number;
}
