import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';

/**
 * Tratamento centralizado de erros HTTP.
 *
 * - 401: token inválido/expirado → limpa sessão e manda para /login
 * - 403: sem permissão → snackbar
 * - 5xx: erro de servidor → snackbar genérico
 * - 0 (network error): snackbar a avisar
 *
 * Os componentes podem na mesma fazer `.subscribe({ error: ... })`
 * para tratar erros 4xx específicos (ex.: 400 num formulário).
 *
 * NOTA: ignoramos erros do próprio /auth/login e /auth/register para que
 * a mensagem de credenciais inválidas apareça inline no formulário, não num snackbar.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const snack = inject(MatSnackBar);

  const isAuthEntry = req.url.includes('/auth/login') || req.url.includes('/auth/register');

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && !isAuthEntry) {
        auth.clearSession();
        router.navigate(['/login'], {
          queryParams: { returnUrl: router.url },
        });
        snack.open('Sessão expirada. Por favor, inicia sessão novamente.', 'OK', { duration: 4000 });
      } else if (err.status === 403) {
        snack.open('Não tens permissão para esta ação.', 'OK', { duration: 4000 });
      } else if (err.status === 0) {
        snack.open('Sem ligação ao servidor. Verifica a tua internet.', 'OK', { duration: 4000 });
      } else if (err.status >= 500) {
        snack.open('Ocorreu um erro no servidor. Tenta novamente.', 'OK', { duration: 4000 });
      }
      // 4xx (exceto 401/403) e tudo o resto propaga para o componente decidir.
      return throwError(() => err);
    }),
  );
};
