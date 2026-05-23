import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { interval, Subscription, switchMap, startWith } from 'rxjs';

import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { canCancelOrder } from '../../shared/order-status.utils';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatSnackBarModule,
  ],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.scss',
})
export class OrderDetail implements OnInit, OnDestroy {
  private readonly orderService = inject(OrderService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly loading = signal(true);
  readonly order = signal<Order | null>(null);
  private pollingSub?: Subscription;

  readonly canCancel = computed(() => {
    const o = this.order();
    if (!o) return false;
    return canCancelOrder(o);
  });

  readonly statusSteps = [
    { id: 'pending', label: 'Pendente', icon: 'schedule' },
    { id: 'confirmed', label: 'Confirmada', icon: 'check_circle' },
    { id: 'preparing', label: 'Em Preparação', icon: 'restaurant' },
    { id: 'delivering', label: 'Em Entrega', icon: 'local_shipping' },
    { id: 'delivered', label: 'Entregue', icon: 'home' }
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/orders']);
      return;
    }

    this.pollingSub = interval(30000)
      .pipe(
        startWith(0),
        switchMap(() => this.orderService.getById(id))
      )
      .subscribe({
        next: (order) => {
          this.order.set(order);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          if (!this.order()) this.router.navigate(['/orders']);
        }
      });
  }

  ngOnDestroy(): void {
    this.pollingSub?.unsubscribe();
  }

  cancelOrder(): void {
    const o = this.order();
    if (!o) return;

    if (confirm('Tem a certeza que deseja cancelar esta encomenda?')) {
      this.orderService.updateStatus(o._id, 'cancelled').subscribe({
        next: (updated) => {
          this.order.set(updated);
          this.snackBar.open('Encomenda cancelada.', 'Fechar', { duration: 3000 });
        },
        error: (err) => {
          const msg = err.error?.code === 'CANCEL_WINDOW_EXPIRED'
            ? 'O prazo de cancelamento (5 min) já expirou.'
            : 'Erro ao cancelar encomenda.';
          this.snackBar.open(msg, 'Fechar', { duration: 5000 });
        }
      });
    }
  }

  isStepActive(stepId: string): boolean {
    const currentStatus = this.order()?.status;
    if (!currentStatus || currentStatus === 'cancelled') return false;

    const statusOrder = ['pending', 'confirmed', 'preparing', 'delivering', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepId);

    return stepIndex <= currentIndex;
  }
}
