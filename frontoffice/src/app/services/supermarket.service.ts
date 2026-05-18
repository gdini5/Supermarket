import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Product } from '../models/product.model';
import { Supermarket } from '../models/supermarket.model';

/**
 * Comunica com /api/v1/supermarkets
 *
 * O backend já filtra para devolver apenas supermercados aprovados e ativos —
 * exatamente os que o cliente final deve ver.
 */
@Injectable({ providedIn: 'root' })
export class SupermarketService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/supermarkets`;

  /** GET /supermarkets — todos os supermercados visíveis para o cliente. */
  list(): Observable<Supermarket[]> {
    return this.http.get<Supermarket[]>(this.baseUrl);
  }

  /** GET /supermarkets/:id */
  getById(id: string): Observable<Supermarket> {
    return this.http.get<Supermarket>(`${this.baseUrl}/${id}`);
  }

  /**
   * GET /supermarkets/:id/products — produtos disponíveis num supermercado.
   * Aceita filtros opcionais idênticos aos do endpoint /products.
   */
  getProducts(
    id: string,
    opts: { category?: string; sort?: 'price_asc' | 'price_desc' } = {},
  ): Observable<Product[]> {
    let params = new HttpParams();
    if (opts.category) params = params.set('category', opts.category);
    if (opts.sort) params = params.set('sort', opts.sort);
    return this.http.get<Product[]>(`${this.baseUrl}/${id}/products`, { params });
  }
}
