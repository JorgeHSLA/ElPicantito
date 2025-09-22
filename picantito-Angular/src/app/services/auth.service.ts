import { Injectable, signal } from '@angular/core';
import { Cliente } from '../models/cliente';
import { Administrador } from '../models/administrador';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signal para el usuario logueado
  private loggedUserSignal = signal<Usuario | null>(null);
  
  // Getter público para el signal
  get loggedUser() {
    return this.loggedUserSignal.asReadonly();
  }

  // Datos quemados de usuarios
  private usuarios: Usuario[] = [
    {
      id: 1,
      nombreCompleto: 'Carlos López García',
      nombreUsuario: 'carlos.lopez',
      telefono: '3009876543',
      correo: 'carlos@email.com',
      contrasenia: 'password123'
    } as Cliente,
    {
      id: 2,
      nombreCompleto: 'Administrador Principal',
      nombreUsuario: 'admin',
      telefono: '3001234567',
      correo: 'admin@elpicantito.com',
      contrasenia: 'admin123'
    } as Administrador
  ];

  constructor() {
    // Verificar si hay usuario en localStorage al inicializar
    this.loadUserFromStorage();
  }

  login(nombreUsuario: string, contrasenia: string): boolean {
    const usuario = this.usuarios.find(u => 
      u.nombreUsuario === nombreUsuario && u.contrasenia === contrasenia
    );

    if (usuario) {
      this.loggedUserSignal.set(usuario);
      localStorage.setItem('loggedUser', JSON.stringify(usuario));
      return true;
    }
    return false;
  }

  logout(): void {
    this.loggedUserSignal.set(null);
    localStorage.removeItem('loggedUser');
  }

  isAdmin(): boolean {
    const user = this.loggedUserSignal();
    return user?.nombreUsuario === 'admin';
  }

  isLoggedIn(): boolean {
    return this.loggedUserSignal() !== null;
  }

  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem('loggedUser');
    if (storedUser) {
      this.loggedUserSignal.set(JSON.parse(storedUser));
    }
  }
}