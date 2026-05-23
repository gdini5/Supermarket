import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';

import { environment } from '../../environments/environment';
import { Cart } from '../models/cart.model';
import { AuthService } from './auth.service';

/*
 Gestão do carrinho de compras.
 O carrinho está no backend, cada operação é um pedido HTTP.
 O signal cartCount serve apenas para o badge do navbar.
*/
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly baseUrl = `${environment.apiUrl}/cart`;

  /* Contagem de itens, usada pelo navbar para o badge. */
  readonly cartCount = signal(0);

  /* Estado atual do carrinho. */
  readonly cart = signal<Cart | null>(null);

  constructor() {
    // Só pré-carrega o carrinho se o utilizador estiver autenticado,
    // evitando pedidos 401 desnecessários que poluem a consola.
    if (this.auth.isAuthenticated()) {
      this.get()
        .pipe(catchError(() => of(null)))
        .subscribe();
    }
  }

  /** GET /cart */
  get(): Observable<Cart> {
    return this.http.get<Cart>(this.baseUrl).pipe(tap((cart) => this.updateSignals(cart)));
  }

  /** POST /cart/add/:id */
  add(productId: string, quantity: number = 1): Observable<Cart> {
    return this.http
      .post<Cart>(`${this.baseUrl}/add/${productId}`, { quantity })
      .pipe(tap((cart) => this.updateSignals(cart)));
  }

  /** PUT /cart/update */
  update(productId: string, quantity: number): Observable<Cart> {
    return this.http
      .put<Cart>(`${this.baseUrl}/update`, { productId, quantity })
      .pipe(tap((cart) => this.updateSignals(cart)));
  }

  /** DELETE /cart/clear */
  clear(): Observable<Cart> {
    return this.http
      .delete<Cart>(`${this.baseUrl}/clear`)
      .pipe(tap((cart) => this.updateSignals(cart)));
  }

  private updateSignals(cart: Cart): void {
    this.cart.set(cart);
    const count = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    this.cartCount.set(count);
  }
}
