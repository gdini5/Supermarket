import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Order, OrderStatus } from '../models/order.model';

/** Estatísticas do cliente, devolvidas por GET /orders/stats. */
export interface OrderStats {
  totalOrders: number;
  totalSpent: number;
  topProduct: { name: string; quantity: number } | null;
}

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

  /** GET /orders/stats — estatísticas do cliente autenticado. */
  stats(): Observable<OrderStats> {
    return this.http.get<OrderStats>(`${this.baseUrl}/stats`);
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
