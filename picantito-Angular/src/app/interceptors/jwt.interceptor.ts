import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  
  // Obtener token del localStorage
  const token = localStorage.getItem('token');
  
  // Si existe token, clonar request y añadir header Authorization
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si recibimos 401 o 403, limpiar localStorage y redirigir a login
      if (error.status === 401 || error.status === 403) {
        // Verificar si el error es por token inválido o usuario no encontrado
        console.warn('Token inválido o sesión expirada. Limpiando sesión...');
        
        // Limpiar localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('tokenType');
        localStorage.removeItem('loggedUser');
        localStorage.removeItem('roles');
        
        // Solo redirigir si no estamos ya en home o login
        const currentUrl = router.url;
        if (!currentUrl.includes('/home') && !currentUrl.includes('/login')) {
          router.navigate(['/home']);
        }
      }
      
      return throwError(() => error);
    })
  );
};
