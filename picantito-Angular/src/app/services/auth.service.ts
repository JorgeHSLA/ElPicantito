import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:9998/api/usuarios';
  
  // Signal para el usuario logueado
  private loggedUserSignal = signal<Usuario | null>(null);
  
  // Getter público para el signal
  get loggedUser() {
    return this.loggedUserSignal.asReadonly();
  }

  constructor(private http: HttpClient) {
    // Verificar si hay usuario en localStorage al inicializar
    this.loadUserFromStorage();
  }

  // Obtener todos los usuarios
  getAllUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.API_URL);
  }

  login(nombreUsuario: string, contrasenia: string): Observable<boolean> {
    const credentials = { nombreUsuario, contrasenia };
    
    return this.http.post<any>(`${this.API_URL}/login`, credentials).pipe(
      map((response) => {
        console.log('🔐 Respuesta del login:', response);
        
        if (response && response.usuario) {
          const usuario = response.usuario;
          
          // Validar que el ID sea un número válido
          if (usuario.id && typeof usuario.id !== 'number') {
            console.warn('⚠️ ID de usuario no es número, convirtiendo:', usuario.id);
            usuario.id = Number(usuario.id);
          }
          
          if (!usuario.id || isNaN(usuario.id) || usuario.id <= 0) {
            console.error('❌ ID de usuario inválido después del login:', usuario.id);
            return false;
          }
          
          console.log('✅ Usuario validado:', {
            id: usuario.id,
            tipo: typeof usuario.id,
            nombre: usuario.nombreCompleto
          });
          
          this.loggedUserSignal.set(usuario);
          localStorage.setItem('loggedUser', JSON.stringify(usuario));
          return true;
        }
        return false;
      }),
      catchError((error) => {
        console.error('Error en login:', error);
        return of(false);
      })
    );
  }

  logout(): void {
    this.loggedUserSignal.set(null);
    localStorage.removeItem('loggedUser');
    // Limpiar también el carrito al cerrar sesión
    localStorage.removeItem('cart');
  }

  isAdmin(): boolean {
    const user = this.loggedUserSignal();
    return user?.rol === 'ADMIN';
  }

  isOperador(): boolean {
    const user = this.loggedUserSignal();
    return user?.rol === 'OPERADOR';
  }

  isLoggedIn(): boolean {
    return this.loggedUserSignal() !== null;
  }

  // Métodos adicionales para el CRUD de usuarios
  crearUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.API_URL, usuario).pipe(
      catchError((error) => {
        console.error('Error al crear usuario:', error);
        throw error;
      })
    );
  }

  obtenerUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API_URL}/${id}`);
  }

  actualizarUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.API_URL}/${id}`, usuario);
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  obtenerUsuariosPorRol(rol: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.API_URL}/tipo/${rol.toLowerCase()}`);
  }

  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem('loggedUser');
    if (storedUser) {
      try {
        const usuario = JSON.parse(storedUser);
        console.log('📦 Usuario cargado desde localStorage:', usuario);
        
        // Validar y convertir el ID si es necesario
        if (usuario.id && typeof usuario.id !== 'number') {
          console.warn('⚠️ ID de usuario en localStorage no es número, convirtiendo:', usuario.id);
          usuario.id = Number(usuario.id);
        }
        
        if (!usuario.id || isNaN(usuario.id) || usuario.id <= 0) {
          console.error('❌ ID de usuario inválido en localStorage, limpiando sesión');
          localStorage.removeItem('loggedUser');
          return;
        }
        
        console.log('✅ Usuario validado desde storage:', {
          id: usuario.id,
          tipo: typeof usuario.id,
          nombre: usuario.nombreCompleto
        });
        
        this.loggedUserSignal.set(usuario);
      } catch (error) {
        console.error('❌ Error al parsear usuario desde localStorage:', error);
        localStorage.removeItem('loggedUser');
      }
    }
  }
}