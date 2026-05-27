import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.getToken();

  const cloned = token
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
        withCredentials: true
      })
    : req.clone({ withCredentials: true });

  return next(cloned).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 0) {
        // Sem rede ou servidor em baixo — propagar para o componente tratar
        console.error('Servidor inacessível ou sem rede.');
      } else if (err.status === 401) {
        auth.clearAuth();
        router.navigate(['/auth/login'], {
          queryParams: { returnUrl: router.url }
        });
      } else if (err.status === 403) {
        // Sem permissão — propagar para o componente mostrar mensagem
        console.warn('Acesso negado (403).');
      }
      return throwError(() => err);
    })
  );
};
