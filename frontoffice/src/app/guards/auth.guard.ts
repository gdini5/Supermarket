import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

/**
 * Guard funcional que protege rotas exigindo cliente autenticado.
 *
 * Se não estiver autenticado, redireciona para /login com o `returnUrl`
 * para que, após login, o utilizador volte ao sítio onde queria entrar.
 *
 * Usar em rotas com:  `canActivate: [authGuard]`
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) return true;

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};
