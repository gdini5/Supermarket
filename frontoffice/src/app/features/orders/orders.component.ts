import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../core/models/order.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>As minhas encomendas</h1>
      </div>

      @if (isLoading) { <app-loading-spinner /> }
      @if (error) { <div class="alert alert-error">{{ error }}</div> }

      @if (!isLoading && !error) {
        @if (orders.length === 0) {
          <div class="empty-state">
            <h3>Sem encomendas</h3>
            <p>Ainda não fez nenhuma encomenda.</p>
            <a routerLink="/shop" class="btn btn-primary" style="margin-top:1rem">Ir às compras →</a>
          </div>
        } @else {
          <div class="orders-list">
            @for (order of orders; track order._id) {
              <a [routerLink]="['/orders', order._id]" class="order-card card">
                <div class="order-header">
                  <div>
                    <strong class="order-sm">{{ order.supermarketId?.name }}</strong>
                    <span class="order-date">{{ order.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
                  </div>
                  <span class="badge" [class]="statusBadge(order.status)" [class.pulse]="order.status === 'delivering'">
                    {{ statusLabel(order.status) }}
                  </span>
                </div>
                <div class="order-meta">
                  <span>{{ order.items.length }} produto(s)</span>
                  <strong class="order-total">{{ order.total | number:'1.2-2' }} €</strong>
                </div>
                @if (canCancel(order)) {
                  <button class="btn btn-danger btn-sm cancel-btn"
                          (click)="cancelOrder(order, $event)">
                    Cancelar
                  </button>
                }
              </a>
            }
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .orders-list { display: flex; flex-direction: column; gap: 1rem; padding-bottom: 2rem; }
    .order-card { display: block; text-decoration: none; color: inherit; transition: border-color .2s, transform .2s; }
    .order-card:hover { border-color: var(--border-light); transform: translateY(-1px); }
    .order-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: .6rem; }
    .order-sm { display: block; font-size: 1rem; }
    .order-date { color: var(--text-2); font-size: .82rem; }
    .order-meta { display: flex; justify-content: space-between; align-items: center; color: var(--text-2); font-size: .88rem; }
    .order-total { color: var(--blue); font-size: 1rem; }
    .btn-sm { padding: .35rem .8rem; font-size: .82rem; }
    .cancel-btn { margin-top: .75rem; align-self: flex-start; }
  `]
})
export class OrdersComponent implements OnInit, OnDestroy {
  private readonly orderService = inject(OrderService);
  private readonly destroy$ = new Subject<void>();

  orders: Order[] = [];
  isLoading = true;
  error = '';

  ngOnInit(): void {
    this.orderService.getOrders().pipe(takeUntil(this.destroy$)).subscribe({
      next: orders => {
        this.orders = orders.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Erro ao carregar encomendas.';
        this.isLoading = false;
      }
    });
  }

  statusBadge(status: string): string {
    const map: Record<string, string> = {
      pending: 'badge-amber',
      confirmed: 'badge-blue',
      preparing: 'badge-amber',
      delivering: 'badge-cyan',
      delivered: 'badge-green',
      cancelled: 'badge-red'
    };
    return map[status] ?? 'badge-blue';
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      pending: 'Pendente',
      confirmed: 'Confirmado',
      preparing: 'Em preparação',
      delivering: 'Em entrega',
      delivered: 'Entregue',
      cancelled: 'Cancelado'
    };
    return map[status] ?? status;
  }

  canCancel(order: Order): boolean {
    if (order.status !== 'confirmed') return false;
    const confirmed = new Date(order.confirmedAt).getTime();
    return Date.now() - confirmed < 5 * 60 * 1000;
  }

  cancelOrder(order: Order, event: Event): void {
    event.preventDefault();
    if (!confirm('Cancelar esta encomenda?')) return;
    this.orderService.updateStatus(order._id, 'cancelled')
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: updated => {
          const idx = this.orders.findIndex(o => o._id === order._id);
          if (idx !== -1) this.orders[idx] = updated;
        },
        error: () => { alert('Erro ao cancelar encomenda.'); }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
