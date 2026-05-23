import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { SupermarketService } from '../../services/supermarket.service';
import { DeliveryMethod } from '../../models/supermarket.model';

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
    const method = this.deliveryMethods().find(m => m.type === this.selectedMethod());
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

        if (cart.supermarketId) {
          this.supermarketService.getById(cart.supermarketId).subscribe({
            next: (sm) => {
              this.deliveryMethods.set(sm.deliveryMethods || []);
              if (this.deliveryMethods().length === 0) {
                this.error.set('Este supermercado não tem métodos de entrega configurados.');
              } else {
                this.selectedMethod.set(this.deliveryMethods()[0].type);
              }
              this.loading.set(false);
            },
            error: () => {
              this.error.set('Não foi possível carregar os métodos de entrega.');
              this.loading.set(false);
            }
          });
        } else {
          this.error.set('O carrinho não tem um supermercado associado.');
          this.loading.set(false);
        }
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['/cart']);
      }
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
      }
    });
  }
}
