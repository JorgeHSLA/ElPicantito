import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class OperadorGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      // Permitir acceso a OPERADOR y ADMIN
      if (this.authService.isOperador() || this.authService.isAdmin()) {
        return true;
      }
    }
    
    this.router.navigate(['/home']);
    return false;
  }
}
