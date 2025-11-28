import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {
  private apiUrl = `${environment.apiUrl}/api/password-reset`;

  constructor(private http: HttpClient) {}

  /**
   * Envía un código de recuperación al correo especificado
   */
  sendResetCode(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-code`, { email });
  }

  /**
   * Verifica un código de recuperación
   */
  verifyResetCode(email: string, code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-code`, { email, code });
  }

  /**
   * Restablece la contraseña con el código verificado
   */
  resetPassword(email: string, code: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { 
      email, 
      code, 
      newPassword 
    });
  }
}
