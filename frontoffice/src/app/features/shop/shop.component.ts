import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { ProductService } from '../../core/services/product.service';
import { SupermarketService } from '../../core/services/supermarket.service';
import { CategoryService } from '../../core/services/category.service';
import { Product, ProductFilters } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';
import { Supermarket } from '../../core/models/supermarket.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent, LoadingSpinnerComponent],
  template: `
    <div class="container">
      <div class="page-header">
        @if (supermarket) {
          <h1>{{ supermarket.name }}</h1>
          <p class="sub">{{ supermarket.address }}</p>
        } @else {
          <h1>Loja</h1>
          <p class="sub">Explore os nossos produtos</p>
        }
      </div>

      <!-- Filters -->
      <div class="filters card">
        <input type="text" [(ngModel)]="searchText" (ngModelChange)="onSearch($event)"
               placeholder="Pesquisar produtos..." class="filter-input">
        <select [(ngModel)]="filters.category" (ngModelChange)="applyFilters()">
          <option value="">Todas as categorias</option>
          @for (cat of categories; track cat._id) {
            <option [value]="cat.name">{{ cat.name }}</option>
          }
        </select>
        <select [(ngModel)]="filters.sort" (ngModelChange)="applyFilters()">
          <option value="">Ordenar por</option>
          <option value="name_asc">Nome A-Z</option>
          <option value="price_asc">Preço ↑</option>
          <option value="price_desc">Preço ↓</option>
        </select>
      </div>

      <!-- Products -->
      @if (isLoading) { <app-loading-spinner /> }

      @if (error) { <div class="alert alert-error">{{ error }}</div> }

      @if (!isLoading && !error) {
        @if (products.length === 0) {
          <div class="empty-state">
            <h3>Nenhum produto encontrado</h3>
            <p>Tente alterar os filtros de pesquisa.</p>
          </div>
        } @else {
          <div class="products-grid">
            @for (p of products; track p._id) {
              <app-product-card [product]="p" />
            }
          </div>
          <!-- Pagination -->
          <div class="pagination">
            <button class="btn btn-ghost" [disabled]="filters.page === 1" (click)="prevPage()">← Anterior</button>
            <span class="page-info">Página {{ filters.page }} de {{ totalPages }}</span>
            <button class="btn btn-ghost" [disabled]="filters.page === totalPages" (click)="nextPage()">Próxima →</button>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .sub { color: var(--text-2); margin-top: .3rem; }
    .filters {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      padding: 1rem;
      margin-bottom: 1.5rem;
    }
    .filter-input { flex: 1; min-width: 200px; }
    select { min-width: 160px; }
    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-top: 2rem;
      padding-bottom: 2rem;
    }
    .page-info { color: var(--text-2); font-size: .88rem; }
  `]
})
export class ShopComponent implements OnInit, OnDestroy {
  private readonly productService = inject(ProductService);
  private readonly smService = inject(SupermarketService);
  private readonly categoryService = inject(CategoryService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroy$ = new Subject<void>();
  private readonly searchInput$ = new Subject<string>();

  products: Product[] = [];
  categories: Category[] = [];
  supermarket?: Supermarket;
  isLoading = false;
  error = '';
  totalPages = 1;
  searchText = '';

  filters: ProductFilters = { page: 1, limit: 12 };
  private supermarketId = '';

  ngOnInit(): void {
    this.supermarketId = this.route.snapshot.paramMap.get('supermarketId') ?? '';
    if (this.supermarketId) {
      this.filters.supermarketId = this.supermarketId;
      this.smService.getSupermarket(this.supermarketId).pipe(takeUntil(this.destroy$))
        .subscribe({ next: sm => (this.supermarket = sm) });
    }

    this.categoryService.getCategories().pipe(takeUntil(this.destroy$))
      .subscribe({ next: cats => (this.categories = cats) });

    this.searchInput$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(text => {
      this.filters.search = text || undefined;
      this.filters.page = 1;
      this.loadProducts();
    });

    this.loadProducts();
  }

  onSearch(text: string): void {
    this.searchInput$.next(text);
  }

  applyFilters(): void {
    this.filters.page = 1;
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.error = '';
    this.productService.getProducts(this.filters).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          this.products = res.products;
          this.totalPages = res.pages;
          this.isLoading = false;
        },
        error: () => {
          this.error = 'Erro ao carregar produtos. Tente novamente.';
          this.isLoading = false;
        }
      });
  }

  prevPage(): void {
    if ((this.filters.page ?? 1) > 1) {
      this.filters.page = (this.filters.page ?? 1) - 1;
      this.loadProducts();
    }
  }

  nextPage(): void {
    if ((this.filters.page ?? 1) < this.totalPages) {
      this.filters.page = (this.filters.page ?? 1) + 1;
      this.loadProducts();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
