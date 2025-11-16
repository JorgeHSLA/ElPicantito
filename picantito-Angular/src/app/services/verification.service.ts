import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VerificationService {
  private apiUrl = 'http://localhost:9998/api/verification';

  constructor(private http: HttpClient) {}

  /**
   * Envía un código de verificación al correo especificado
   */
  sendVerificationCode(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-code`, { email });
  }

  /**
   * Verifica un código de verificación
   */
  verifyCode(email: string, code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-code`, { email, code });
  }

  /**
   * Verifica si un email ya está verificado
   */
  checkEmailVerification(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/check-email/${email}`);
  }
}
