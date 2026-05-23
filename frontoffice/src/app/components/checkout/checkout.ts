import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';

import { DeliveryMethod } from '../../models/supermarket.model';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { SupermarketService } from '../../services/supermarket.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatRadioModule,
    MatDividerModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly orderService = inject(OrderService);
  private readonly supermarketService = inject(SupermarketService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly loading = signal(true);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly cart = this.cartService.cart;
  readonly deliveryMethods = signal<DeliveryMethod[]>([]);
  readonly selectedMethod = signal<'pickup' | 'courier'>('pickup');

  readonly subtotal = computed(() => {
    const items = this.cart()?.items ?? [];
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  });

  readonly deliveryCost = computed(() => {
    const method = this.deliveryMethods().find((m) => m.type === this.selectedMethod());
    return method?.cost ?? 0;
  });

  readonly total = computed(() => this.subtotal() + this.deliveryCost());

  ngOnInit(): void {
    this.cartService.get().subscribe({
      next: (cart) => {
        if (!cart || cart.items.length === 0) {
          this.router.navigate(['/cart']);
          return;
        }

        // Normalizar o supermarketId: pode vir como string ou (raramente) objeto
        const smId =
          typeof cart.supermarketId === 'object' && cart.supermarketId !== null
            ? (cart.supermarketId as any)._id
            : cart.supermarketId;

        if (!smId) {
          this.error.set(
            'O carrinho não tem um supermercado associado. Volta ao carrinho e tenta novamente.',
          );
          this.loading.set(false);
          return;
        }

        this.supermarketService.getById(smId).subscribe({
          next: (sm) => {
            const methods = sm.deliveryMethods || [];
            this.deliveryMethods.set(methods);
            if (methods.length === 0) {
              this.error.set(
                'Este supermercado ainda não configurou métodos de entrega. Não é possível finalizar a encomenda.',
              );
            } else {
              this.selectedMethod.set(methods[0].type);
            }
            this.loading.set(false);
          },
          error: () => {
            this.error.set(
              'Não foi possível carregar os métodos de entrega. Verifica a tua ligação e tenta novamente.',
            );
            this.loading.set(false);
          },
        });
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['/cart']);
      },
    });
  }

  confirmOrder(): void {
    this.submitting.set(true);
    this.orderService.create(this.selectedMethod()).subscribe({
      next: (order) => {
        this.snackBar.open('Encomenda realizada com sucesso!', 'Fechar', { duration: 3000 });
        this.router.navigate(['/orders', order._id]);
      },
      error: (err) => {
        this.submitting.set(false);
        const msg = err.error?.message || 'Erro ao realizar encomenda.';
        this.snackBar.open(msg, 'Fechar', { duration: 5000 });
      },
    });
  }
}
