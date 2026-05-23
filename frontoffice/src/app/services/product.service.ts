import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { PaginatedProducts, Product, ProductQuery } from '../models/product.model';

/**
 * Comunica com /api/v1/products
 *
 * Os filtros do enunciado (pesquisa por nome, filtragem por categoria,
 * ordenação por preço, comparação entre supermercados) são todos aqui.
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/products`;

  /**
   * GET /products — listagem paginada com filtros opcionais.
   * Apenas devolve produtos com stock>0 e de supermercados aprovados (regra do backend).
   */
  list(query: ProductQuery = {}): Observable<PaginatedProducts> {
    let params = new HttpParams();
    if (query.search) params = params.set('search', query.search);
    if (query.category) params = params.set('category', query.category);
    if (query.supermarketId) params = params.set('supermarketId', query.supermarketId);
    if (query.sort) params = params.set('sort', query.sort);
    if (query.page) params = params.set('page', String(query.page));
    if (query.limit) params = params.set('limit', String(query.limit));

    return this.http.get<PaginatedProducts>(this.baseUrl, { params });
  }

  /**
   * GET /products/:id — detalhe de um produto.
   */
  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  /**
   * GET /products/compare?name=... — comparação de preços do mesmo produto
   * entre supermercados (resultado já vem ordenado por preço ascendente).
   *
   * Cumpre o requisito "Comparação de Produtos" do enunciado:
   *   "O sistema deve permitir comparar preços do mesmo produto entre diferentes
   *    supermercados. Exemplo: Leite — Mercado A 0.89€ — Mercado B 0.95€"
   */
  compareByName(name: string): Observable<Product[]> {
    const params = new HttpParams().set('name', name);
    return this.http.get<Product[]>(`${this.baseUrl}/compare`, { params });
  }
}
