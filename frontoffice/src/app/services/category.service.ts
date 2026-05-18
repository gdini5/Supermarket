import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

import { environment } from '../../environments/environment';
import { Category } from '../models/category.model';

/**
 * Categorias geridas pelo admin. Como mudam muito pouco e são consumidas
 * em vários sítios (filtros do shop, product-detail), cacheamos com shareReplay.
 */
@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/categories`;

  private cache$?: Observable<Category[]>;

  list(): Observable<Category[]> {
    if (!this.cache$) {
      this.cache$ = this.http.get<Category[]>(this.baseUrl).pipe(shareReplay(1));
    }
    return this.cache$;
  }

  /** Forçar refresh (ex.: depois de o admin criar uma categoria — não acontece no frontoffice). */
  invalidate(): void {
    this.cache$ = undefined;
  }
}
