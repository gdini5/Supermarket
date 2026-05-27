import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    MatSnackBarModule,
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly snackBar = inject(MatSnackBar);

  readonly loading = signal(true);
  readonly cart = this.cartService.cart;

  readonly total = computed(() => {
    const items = this.cart()?.items ?? [];
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  });

  ngOnInit(): void {
    this.cartService.get().subscribe({
      next: () => this.loading.set(false),
      error: () => this.loading.set(false),
    });
  }

  updateQuantity(item: CartItem, delta: number): void {
    const newQty = item.quantity + delta;
    if (newQty < 0) return;

    this.cartService.update(item.productId, newQty).subscribe({
      error: (err) => {
        if (err.error?.code === 'DIFFERENT_SUPERMARKET') {
          this.snackBar.open('Não é possível misturar produtos de supermercados diferentes.', 'Fechar', { duration: 3000 });
        }
      }
    });
  }

  removeItem(item: CartItem): void {
    this.cartService.update(item.productId, 0).subscribe();
  }

  clearCart(): void {
    this.cartService.clear().subscribe();
  }
}
