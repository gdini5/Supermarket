import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly snackBar = inject(MatSnackBar);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly cart = this.cartService.cart;

  readonly total = computed(() => {
    const items = this.cart()?.items ?? [];
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  });

  ngOnInit(): void {
    this.cartService.get().subscribe({
      next: () => this.loading.set(false),
      error: () => {
        this.error.set('Não foi possível carregar o carrinho. Tenta novamente.');
        this.loading.set(false);
      },
    });
  }

  updateQuantity(item: CartItem, delta: number): void {
    const newQty = item.quantity + delta;
    if (newQty < 0) return;
    this.cartService.update(item.productId, newQty).subscribe({
      error: (err) => {
        const msg = err.error?.code === 'INSUFFICIENT_STOCK'
          ? (err.error?.error ?? 'Stock insuficiente.')
          : err.error?.code === 'DIFFERENT_SUPERMARKET'
            ? 'Não é possível misturar produtos de supermercados diferentes.'
            : 'Não foi possível atualizar a quantidade.';
        this.snackBar.open(msg, 'Fechar', { duration: 3500 });
      }
    });
  }

  removeItem(item: CartItem): void {
    this.cartService.update(item.productId, 0).subscribe();
  }

  clearCart(): void {
    this.cartService.clear().subscribe();
  }

  /** URL completa da imagem (servida pelo backend). */
  imageUrl(item: CartItem): string {
    const base = environment.apiUrl.replace(/\/api\/v1\/?$/, '');
    const file = item.image || 'default-product.png';
    return `${base}/images/uploads/${file}`;
  }

  /** Quando a imagem falha, esconde-a e mostra o ícone de fallback. */
  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    const icon = img.nextElementSibling as HTMLElement;
    if (icon) icon.style.display = 'flex';
  }
}
