import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Order, OrderStatus } from '../models/order.model';

/**
 * Gestão de encomendas — consome /api/v1/orders.
 */
@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/orders`;

  /** GET /orders */
  list(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl);
  }

  /** POST /orders */
  create(deliveryMethod: 'pickup' | 'courier'): Observable<Order> {
    return this.http.post<Order>(this.baseUrl, { deliveryMethod });
  }

  /** GET /orders/:id */
  getById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${id}`);
  }

  /** PATCH /orders/:id/status */
  updateStatus(id: string, status: OrderStatus): Observable<Order> {
    return this.http.patch<Order>(`${this.baseUrl}/${id}/status`, { status });
  }
}
