import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Usuario } from '../models/usuario';
import { Router } from '@angular/router';

interface LoginResponse {
  token: string;
  type: string;
  id: number;
  nombreUsuario: string;
  nombreCompleto: string;
  correo: string;
  telefono?: string;
  roles: string[];
}

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

  constructor(private http: HttpClient, private router: Router) {
    // Verificar si hay usuario en localStorage al inicializar
    this.loadUserFromStorage();
  }

  // Obtener todos los usuarios
  getAllUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.API_URL);
  }

  login(nombreUsuario: string, contrasenia: string): Observable<boolean> {
    const credentials = { nombreUsuario, contrasenia };
    
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials).pipe(
      map((response) => {
        console.log('🔐 Respuesta del login:', response);
        
        if (response && response.token) {
          // Guardar token
          localStorage.setItem('token', response.token);
          localStorage.setItem('tokenType', response.type);
          
          // Crear objeto Usuario compatible con el modelo existente
          const usuario: Usuario = {
            id: response.id,
            nombreCompleto: response.nombreCompleto,
            nombreUsuario: response.nombreUsuario,
            correo: response.correo,
            telefono: response.telefono || '', // Obtener del LoginResponse si está disponible
            contrasenia: '', // No se debe guardar
            rol: response.roles[0], // Primer rol
            activo: true,
            estado: undefined
          };
          
          console.log('✅ Usuario creado desde JWT:', usuario);
          
          this.loggedUserSignal.set(usuario);
          localStorage.setItem('loggedUser', JSON.stringify(usuario));
          localStorage.setItem('roles', JSON.stringify(response.roles));
          
          return true;
        }
        return false;
      }),
      catchError((error) => {
        console.error('❌ Error en login:', error);
        return of(false);
      })
    );
  }

  logout(): Observable<void> {
    const token = this.getToken();
    
    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      
      return this.http.post<any>(`${this.API_URL}/logout`, {}, { headers }).pipe(
        tap(() => {
          this.clearSession();
        }),
        catchError((error) => {
          console.error('❌ Error en logout:', error);
          // Limpiar sesión de todas formas
          this.clearSession();
          return of(void 0);
        })
      );
    }
    
    this.clearSession();
    return of(void 0);
  }

  private clearSession(): void {
    this.loggedUserSignal.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('tokenType');
    localStorage.removeItem('loggedUser');
    localStorage.removeItem('roles');
    localStorage.removeItem('cart');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRoles(): string[] {
    const rolesStr = localStorage.getItem('roles');
    return rolesStr ? JSON.parse(rolesStr) : [];
  }

  hasRole(role: string): boolean {
    const roles = this.getRoles();
    return roles.includes(role);
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  isOperador(): boolean {
    return this.hasRole('OPERADOR');
  }

  isCliente(): boolean {
    return this.hasRole('CLIENTE');
  }

  isRepartidor(): boolean {
    return this.hasRole('REPARTIDOR');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null && this.loggedUserSignal() !== null;
  }

  // Redirigir según rol
  redirectByRole(): void {
    if (this.isAdmin()) {
      this.router.navigate(['/admin']);
    } else if (this.isOperador()) {
      this.router.navigate(['/operador']);
    } else if (this.isCliente()) {
      this.router.navigate(['/home']);
    } else if (this.isRepartidor()) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/']);
    }
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