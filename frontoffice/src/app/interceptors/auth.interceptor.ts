import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

/**
 * Interceptor funcional: adiciona o header `Authorization: Bearer <token>`
 * a todos os pedidos dirigidos à API do backend.
 *
 * Só decora pedidos para a nossa API (evita enviar o token para terceiros
 * caso algum serviço externo seja usado no futuro, ex.: Stripe).
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();

  const isApiRequest = req.url.startsWith(environment.apiUrl);

  // Pedidos externos (Nominatim, etc.) passam sem modificação.
  if (!isApiRequest) return next(req);

  // withCredentials envia o cookie de sessão necessário para o carrinho
  // (o backend usa req.session.cart — sem o cookie a sessão fica vazia).
  const base = req.clone({ withCredentials: true });

  if (token) {
    return next(base.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    }));
  }

  return next(base);
};
