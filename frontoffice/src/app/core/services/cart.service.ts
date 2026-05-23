import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CartItem {
  productId: { _id: string; name: string; price: number; priceUnit: string; image: string };
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/cart`;

  private _items$ = new BehaviorSubject<CartItem[]>([]);
  readonly items$ = this._items$.asObservable();

  readonly total$ = this._items$.pipe(
    map(items => items.reduce((sum, i) => sum + i.productId.price * i.quantity, 0))
  );

  readonly itemCount$ = this._items$.pipe(
    map(items => items.reduce((sum, i) => sum + i.quantity, 0))
  );

  getCart(): Observable<{ items: CartItem[] }> {
    return this.http.get<{ items: CartItem[] }>(this.base, { withCredentials: true }).pipe(
      tap(res => this._items$.next(res.items ?? []))
    );
  }

  addToCart(productId: string): Observable<unknown> {
    return this.http.post(`${this.base}/add/${productId}`, {}, { withCredentials: true }).pipe(
      tap(() => this.getCart().subscribe())
    );
  }

  updateItem(productId: string, quantity: number): Observable<unknown> {
    return this.http.put(`${this.base}/update`, { productId, quantity }, { withCredentials: true }).pipe(
      tap(() => this.getCart().subscribe())
    );
  }

  clearCart(): Observable<unknown> {
    return this.http.delete(`${this.base}/clear`, { withCredentials: true }).pipe(
      tap(() => this._items$.next([]))
    );
  }
}
