import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { Product } from '../../core/models/product.model';
import { PriceUnitPipe } from '../../shared/pipes/price-unit.pipe';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, PriceUnitPipe, LoadingSpinnerComponent],
  template: `
    <div class="container">
      <button class="btn btn-ghost back-btn" (click)="router.navigate(['/shop'])">← Voltar à loja</button>

      @if (isLoading) { <app-loading-spinner /> }
      @if (error) { <div class="alert alert-error">{{ error }}</div> }

      @if (product && !isLoading) {
        <div class="detail-layout">
          <!-- Left: image -->
          <div class="detail-img-wrap">
            <img [src]="product.image || 'assets/no-image.png'"
                 [alt]="product.name"
                 (error)="onImgError($event)">
            <span class="badge badge-blue">{{ product.category }}</span>
          </div>

          <!-- Right: info -->
          <div class="detail-info">
            <h1>{{ product.name }}</h1>
            <p class="sm-name">{{ product.supermarketId?.name }}</p>
            <div class="detail-price">{{ product.price | priceUnit: product.priceUnit }}</div>
            @if (product.description) { <p class="detail-desc">{{ product.description }}</p> }
            <p class="stock-info" [class.out]="product.stock === 0">
              {{ product.stock > 0 ? 'Em stock: ' + product.stock + ' unidades' : 'Sem stock disponível' }}
            </p>

            @if (auth.isLoggedIn() && product.stock > 0) {
              <button class="btn btn-primary add-btn"
                      [disabled]="adding"
                      (click)="addToCart()">
                {{ added ? '✓ Adicionado ao carrinho!' : 'Adicionar ao carrinho' }}
              </button>
            }
            @if (!auth.isLoggedIn()) {
              <p class="login-hint">
                <a routerLink="/auth/login">Inicie sessão</a> para adicionar ao carrinho.
              </p>
            }
          </div>
        </div>

        <!-- Compare section -->
        @if (showCompare) {
          <div class="compare-section card">
            <h2>Comparação de preços</h2>
            @if (compareLoading) { <app-loading-spinner /> }
            @if (!compareLoading && compareProducts.length > 0) {
              <table>
                <thead>
                  <tr>
                    <th>Supermercado</th>
                    <th>Preço</th>
                    <th>Diferença</th>
                  </tr>
                </thead>
                <tbody>
                  @for (p of compareProducts; track p._id; let i = $index) {
                    <tr [class.cheapest]="i === 0">
                      <td>{{ p.supermarketId?.name }}</td>
                      <td>
                        {{ p.price | priceUnit: p.priceUnit }}
                        @if (i === 0) { <span class="badge badge-green">Mais barato</span> }
                      </td>
                      <td>
                        @if (i === 0) {
                          <span class="text-green">—</span>
                        } @else {
                          <span class="text-red">+{{ priceDiff(p.price) }}</span>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            }
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .back-btn { margin: 1rem 0; }
    .detail-layout {
      display: grid;
      grid-template-columns: 360px 1fr;
      gap: 2rem;
      margin: 1.5rem 0 2rem;
      align-items: start;
    }
    @media (max-width: 768px) { .detail-layout { grid-template-columns: 1fr; } }
    .detail-img-wrap {
      position: relative;
      border-radius: var(--radius-lg);
      overflow: hidden;
      background: var(--bg-4);
    }
    .detail-img-wrap img { width: 100%; height: 300px; object-fit: cover; }
    .detail-img-wrap .badge { position: absolute; top: .8rem; left: .8rem; }
    .detail-info { display: flex; flex-direction: column; gap: .6rem; }
    .sm-name { color: var(--text-2); }
    .detail-price { font-size: 1.8rem; font-weight: 800; color: var(--blue); }
    .detail-desc { color: var(--text-2); line-height: 1.7; }
    .stock-info { color: var(--green); font-size: .88rem; }
    .stock-info.out { color: var(--red); }
    .add-btn { margin-top: .5rem; padding: .7rem 1.5rem; font-size: 1rem; }
    .login-hint { color: var(--text-2); font-size: .88rem; }
    .compare-section { margin-bottom: 2rem; }
    .compare-section h2 { margin-bottom: 1rem; }
    .cheapest { background: rgba(16,185,129,.06); }
    .text-green { color: var(--green); }
    .text-red { color: var(--red); }
  `]
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  readonly router = inject(Router);
  readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly cart = inject(CartService);
  private readonly destroy$ = new Subject<void>();

  product?: Product;
  compareProducts: Product[] = [];
  isLoading = true;
  compareLoading = false;
  error = '';
  adding = false;
  added = false;
  showCompare = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.showCompare = this.route.snapshot.queryParamMap.get('compare') === 'true';

    this.productService.getProduct(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: p => {
        this.product = p;
        this.isLoading = false;
        if (this.showCompare) this.loadCompare(p.name);
      },
      error: () => {
        this.error = 'Produto não encontrado.';
        this.isLoading = false;
      }
    });
  }

  loadCompare(name: string): void {
    this.compareLoading = true;
    this.productService.compareProducts(name).pipe(takeUntil(this.destroy$)).subscribe({
      next: ps => {
        this.compareProducts = ps.sort((a, b) => a.price - b.price);
        this.compareLoading = false;
      },
      error: () => { this.compareLoading = false; }
    });
  }

  priceDiff(price: number): string {
    const cheapest = this.compareProducts[0]?.price ?? 0;
    return new Intl.NumberFormat('pt-PT', { minimumFractionDigits: 2 }).format(price - cheapest) + ' €';
  }

  addToCart(): void {
    if (!this.product) return;
    this.adding = true;
    this.cart.addToCart(this.product._id).subscribe({
      next: () => {
        this.adding = false;
        this.added = true;
        setTimeout(() => (this.added = false), 2000);
      },
      error: () => { this.adding = false; }
    });
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/no-image.png';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
