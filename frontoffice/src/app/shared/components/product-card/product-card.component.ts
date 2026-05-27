import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { PriceUnitPipe } from '../../pipes/price-unit.pipe';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, PriceUnitPipe],
  template: `
    <div class="product-card">
      <div class="product-img-wrap">
        <img [src]="product.image || 'assets/no-image.png'"
             [alt]="product.name"
             (error)="onImgError($event)">
        <span class="badge badge-blue cat-badge">{{ product.category }}</span>
      </div>
      <div class="product-body">
        <h3 class="product-name">{{ product.name }}</h3>
        <p class="product-sm">{{ product.supermarketId?.name }}</p>
        <div class="product-price">{{ product.price | priceUnit: product.priceUnit }}</div>
        <p class="product-stock" [class.out]="product.stock === 0">
          {{ product.stock > 0 ? 'Stock: ' + product.stock : 'Sem stock' }}
        </p>
        <div class="product-actions">
          @if (isLoggedIn && product.stock > 0) {
            <button class="btn btn-primary btn-sm" [disabled]="adding" (click)="addToCart()">
              {{ added ? '✓ Adicionado' : 'Adicionar ao carrinho' }}
            </button>
          }
          <button class="btn btn-ghost btn-sm" (click)="compare()">Comparar preços</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      background: var(--bg-3);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      overflow: hidden;
      transition: border-color .2s, transform .2s;
      display: flex;
      flex-direction: column;
    }
    .product-card:hover { border-color: var(--border-light); transform: translateY(-2px); }

    .product-img-wrap {
      position: relative;
      height: 160px;
      background: var(--bg-4);
      overflow: hidden;
    }
    .product-img-wrap img {
      width: 100%; height: 100%; object-fit: cover;
    }
    .cat-badge {
      position: absolute;
      top: .6rem;
      left: .6rem;
    }

    .product-body {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: .3rem;
      flex: 1;
    }
    .product-name { font-size: 1rem; font-weight: 600; }
    .product-sm { color: var(--text-2); font-size: .82rem; }
    .product-price { color: var(--blue); font-weight: 700; font-size: 1.05rem; }
    .product-stock { font-size: .8rem; color: var(--green); }
    .product-stock.out { color: var(--red); }

    .product-actions {
      display: flex;
      gap: .5rem;
      flex-wrap: wrap;
      margin-top: .5rem;
    }
    .btn-sm { padding: .4rem .8rem; font-size: .82rem; }
  `]
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() cartAdded = new EventEmitter<void>();

  private readonly auth = inject(AuthService);
  private readonly cart = inject(CartService);
  private readonly router = inject(Router);

  adding = false;
  added = false;

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/no-image.png';
  }

  addToCart(): void {
    this.adding = true;
    this.cart.addToCart(this.product._id).subscribe({
      next: () => {
        this.adding = false;
        this.added = true;
        this.cartAdded.emit();
        setTimeout(() => (this.added = false), 2000);
      },
      error: () => { this.adding = false; }
    });
  }

  compare(): void {
    this.router.navigate(['/product', this.product._id], { queryParams: { compare: true } });
  }
}
