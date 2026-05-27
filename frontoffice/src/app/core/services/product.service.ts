import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, ProductListResponse, ProductFilters } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/products`;

  getProducts(filters: ProductFilters = {}): Observable<ProductListResponse> {
    let params = new HttpParams();
    if (filters.search)        params = params.set('search', filters.search);
    if (filters.category)      params = params.set('category', filters.category);
    if (filters.supermarketId) params = params.set('supermarketId', filters.supermarketId);
    if (filters.sort)          params = params.set('sort', filters.sort);
    if (filters.page != null)  params = params.set('page', String(filters.page));
    if (filters.limit != null) params = params.set('limit', String(filters.limit));
    return this.http.get<ProductListResponse>(this.base, { params });
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.base}/${id}`);
  }

  compareProducts(name: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.base}/compare`, {
      params: new HttpParams().set('name', name)
    });
  }
}
