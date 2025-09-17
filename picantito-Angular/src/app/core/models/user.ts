export interface User {
  id?: number;
  nombreCompleto: string;
  nombreUsuario: string;
  email: string;
  telefono: string;
  direccion: string;
  role: 'USER' | 'ADMIN';
  admin?: boolean;
}