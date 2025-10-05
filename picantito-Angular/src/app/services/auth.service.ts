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

  login(nombreUsuario: string, contrasenia: string): Observable<boolean> {
    const credentials = { nombreUsuario, contrasenia };
    
    return this.http.post<any>(`${this.API_URL}/login`, credentials).pipe(
      map((response) => {
        if (response && response.usuario) {
          const usuario = response.usuario;
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
  }

  isAdmin(): boolean {
    const user = this.loggedUserSignal();
    return user?.rol === 'ADMIN';
  }

  isLoggedIn(): boolean {
    return this.loggedUserSignal() !== null;
  }

  // Métodos adicionales para el CRUD de usuarios
  crearUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.API_URL, usuario);
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
      this.loggedUserSignal.set(JSON.parse(storedUser));
    }
  }
}