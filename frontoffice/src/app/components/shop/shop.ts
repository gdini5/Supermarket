import { CurrencyPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil, tap } from 'rxjs';

import { Category } from '../../models/category.model';
import { PaginatedProducts, Product, ProductQuery } from '../../models/product.model';
import { Supermarket } from '../../models/supermarket.model';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { SupermarketService } from '../../services/supermarket.service';

/**
 * Página de catálogo. Implementa todos os requisitos de pesquisa do enunciado:
 *  - Pesquisar produtos por nome
 *  - Filtrar por categoria
 *  - Ordenar por preço (asc/desc)
 *  - Filtrar por supermercado (via query param, vindo do Home)
 *  - Visualizar supermercado que vende cada produto
 *
 * A pesquisa por nome usa debounce 300ms para não bombardear o servidor.
 * Os filtros estão sincronizados com a URL — partilhar o link reproduz o estado.
 */
@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatChipsModule,
    MatDividerModule,
    CurrencyPipe,
  ],
  templateUrl: './shop.html',
  styleUrl: './shop.scss',
})
export class Shop implements OnInit, OnDestroy {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly supermarketService = inject(SupermarketService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  private readonly destroy$ = new Subject<void>();
  private readonly trigger$ = new Subject<ProductQuery>();

  readonly loading = signal(false);
  readonly products = signal<Product[]>([]);
  readonly total = signal(0);
  readonly page = signal(1);
  readonly pageSize = signal(12);
  readonly categories = signal<Category[]>([]);
  readonly supermarkets = signal<Supermarket[]>([]);

  /** Form reativo com todos os filtros — single source of truth. */
  readonly filterForm = this.fb.nonNullable.group({
    search: [''],
    category: [''],
    supermarketId: [''],
    sort: ['' as '' | 'price_asc' | 'price_desc'],
  });

  /** Nome do supermercado quando estamos a filtrar por um (para mostrar no chip). */
  readonly selectedSupermarketName = computed(() => {
    const id = this.filterForm.controls.supermarketId.value;
    if (!id) return null;
    return this.supermarkets().find((s) => s._id === id)?.name ?? null;
  });

  ngOnInit(): void {
    // Carregar categorias e supermercados (para os dropdowns) em paralelo
    this.categoryService.list().subscribe((cs) => this.categories.set(cs));
    this.supermarketService.list().subscribe((ss) => this.supermarkets.set(ss));

    // Inicializar form a partir dos query params da URL (deep-linking)
    const qp = this.route.snapshot.queryParamMap;
    this.filterForm.patchValue(
      {
        search: qp.get('search') ?? '',
        category: qp.get('category') ?? '',
        supermarketId: qp.get('supermarketId') ?? '',
        sort: (qp.get('sort') as '' | 'price_asc' | 'price_desc') ?? '',
      },
      { emitEvent: false },
    );
    if (qp.get('page')) this.page.set(Number(qp.get('page')) || 1);

    // Sempre que o formulário muda, voltar à página 1 e disparar nova pesquisa
    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.page.set(1);
        this.runQuery();
      });

    // Pipe que executa de facto o pedido HTTP. Usar switchMap garante que
    // pedidos antigos são cancelados quando um novo é despoletado.
    this.trigger$
      .pipe(
        tap(() => this.loading.set(true)),
        switchMap((q) => this.productService.list(q)),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: (res: PaginatedProducts) => {
          this.products.set(res.products);
          this.total.set(res.total);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });

    // Primeira pesquisa
    this.runQuery();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Constrói o ProductQuery a partir do form + paginação, atualiza a URL e
   * empurra para o trigger.
   */
  private runQuery(): void {
    const v = this.filterForm.getRawValue();
    const query: ProductQuery = {
      search: v.search.trim() || undefined,
      category: v.category || undefined,
      supermarketId: v.supermarketId || undefined,
      sort: v.sort || undefined,
      page: this.page(),
      limit: this.pageSize(),
    };

    // Sincronizar URL — sem recarregar a rota
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        search: query.search ?? null,
        category: query.category ?? null,
        supermarketId: query.supermarketId ?? null,
        sort: query.sort ?? null,
        page: this.page() > 1 ? this.page() : null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });

    this.trigger$.next(query);
  }

  onPage(e: PageEvent): void {
    this.page.set(e.pageIndex + 1);
    this.pageSize.set(e.pageSize);
    this.runQuery();
  }

  clearFilters(): void {
    this.filterForm.reset({ search: '', category: '', supermarketId: '', sort: '' });
  }

  clearSupermarketFilter(): void {
    this.filterForm.patchValue({ supermarketId: '' });
  }

  /**
   * Helper para extrair o nome do supermercado do produto, lidando com o caso
   * de a referência estar populada (objeto) ou apenas como ID (string).
   */
  supermarketNameOf(product: Product): string {
    if (typeof product.supermarketId === 'string') {
      return this.supermarkets().find((s) => s._id === product.supermarketId)?.name ?? '—';
    }
    return product.supermarketId.name;
  }
}
