import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Subject, takeUntil, debounceTime } from 'rxjs';
import { CartService, CartItem } from '../../core/services/cart.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { PriceUnitPipe } from '../../shared/pipes/price-unit.pipe';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, AsyncPipe, RouterLink, LoadingSpinnerComponent, PriceUnitPipe],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>Carrinho</h1>
      </div>

      @if (isLoading) { <app-loading-spinner /> }
      @if (error) { <div class="alert alert-error">{{ error }}</div> }

      @if (!isLoading) {
        @if ((cartService.items$ | async)?.length === 0) {
          <div class="empty-state">
            <h3>O seu carrinho está vazio</h3>
            <p>Adicione produtos para começar as suas compras.</p>
            <a routerLink="/shop" class="btn btn-primary" style="margin-top:1rem">Ir às compras →</a>
          </div>
        } @else {
          <div class="cart-layout">
            <div class="cart-items card">
              <table>
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Preço</th>
                    <th>Quantidade</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  @for (item of (cartService.items$ | async); track item.productId._id) {
                    <tr>
                      <td>
                        <div class="item-name">
                          <img [src]="item.productId.image || 'assets/no-image.png'"
                               [alt]="item.productId.name"
                               class="item-img"
                               (error)="onImgError($event)">
                          {{ item.productId.name }}
                        </div>
                      </td>
                      <td>{{ item.productId.price | priceUnit: $any(item.productId.priceUnit) }}</td>
                      <td>
                        <div class="qty-ctrl">
                          <button class="btn btn-ghost btn-xs" (click)="changeQty(item, item.quantity - 1)" [disabled]="item.quantity <= 1">−</button>
                          <span>{{ item.quantity }}</span>
                          <button class="btn btn-ghost btn-xs" (click)="changeQty(item, item.quantity + 1)">+</button>
                        </div>
                      </td>
                      <td class="subtotal">{{ item.productId.price * item.quantity | number:'1.2-2' }} €</td>
                      <td>
                        <button class="btn btn-danger btn-xs" (click)="removeItem(item)">✕</button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <div class="cart-summary card">
              <h3>Resumo</h3>
              <div class="summary-row">
                <span>Total de produtos</span>
                <strong>{{ (cartService.total$ | async) | number:'1.2-2' }} €</strong>
              </div>
              <p class="summary-note">Custos de entrega calculados no checkout.</p>
              <div class="summary-actions">
                <button class="btn btn-danger" (click)="confirmClear()">Limpar carrinho</button>
                <a routerLink="/checkout" class="btn btn-primary">Finalizar encomenda →</a>
              </div>
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .cart-layout {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 1.5rem;
      align-items: start;
      padding-bottom: 2rem;
    }
    @media (max-width: 768px) { .cart-layout { grid-template-columns: 1fr; } }
    .item-name { display: flex; align-items: center; gap: .6rem; }
    .item-img { width: 40px; height: 40px; object-fit: cover; border-radius: var(--radius); }
    .qty-ctrl { display: flex; align-items: center; gap: .4rem; }
    .btn-xs { padding: .2rem .55rem; font-size: .8rem; }
    .subtotal { font-weight: 600; color: var(--blue); }
    .summary-row { display: flex; justify-content: space-between; margin: .8rem 0; }
    .summary-note { color: var(--text-2); font-size: .8rem; margin-bottom: 1rem; }
    .summary-actions { display: flex; flex-direction: column; gap: .6rem; }
  `]
})
export class CartComponent implements OnInit, OnDestroy {
  readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();
  private readonly qtyChange$ = new Subject<{ id: string; qty: number }>();

  isLoading = true;
  error = '';

  ngOnInit(): void {
    this.cartService.getCart().pipe(takeUntil(this.destroy$)).subscribe({
      next: () => { this.isLoading = false; },
      error: () => {
        this.error = 'Erro ao carregar o carrinho.';
        this.isLoading = false;
      }
    });

    this.qtyChange$.pipe(
      debounceTime(300),
      takeUntil(this.destroy$)
    ).subscribe(({ id, qty }) => {
      this.cartService.updateItem(id, qty).subscribe();
    });
  }

  changeQty(item: CartItem, qty: number): void {
    if (qty < 1) return;
    this.qtyChange$.next({ id: item.productId._id, qty });
  }

  removeItem(item: CartItem): void {
    this.cartService.updateItem(item.productId._id, 0).subscribe();
  }

  confirmClear(): void {
    if (confirm('Tem a certeza que pretende limpar o carrinho?')) {
      this.cartService.clearCart().subscribe();
    }
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/no-image.png';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
