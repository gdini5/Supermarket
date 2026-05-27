import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Supermarket } from '../models/supermarket.model';
import { ProductListResponse, ProductFilters } from '../models/product.model';
import { HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class SupermarketService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/supermarkets`;

  getSupermarkets(): Observable<Supermarket[]> {
    return this.http.get<Supermarket[]>(this.base);
  }

  getSupermarket(id: string): Observable<Supermarket> {
    return this.http.get<Supermarket>(`${this.base}/${id}`);
  }

  getSupermarketProducts(id: string, filters: ProductFilters = {}): Observable<ProductListResponse> {
    let params = new HttpParams();
    if (filters.search)        params = params.set('search', filters.search);
    if (filters.category)      params = params.set('category', filters.category);
    if (filters.sort)          params = params.set('sort', filters.sort);
    if (filters.page != null)  params = params.set('page', String(filters.page));
    if (filters.limit != null) params = params.set('limit', String(filters.limit));
    return this.http.get<ProductListResponse>(`${this.base}/${id}/products`, { params });
  }
}
