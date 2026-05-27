import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, takeUntil, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OrderService } from '../../core/services/order.service';
import { MapService, GeoCoords } from '../../core/services/map.service';
import { Order } from '../../core/models/order.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import * as L from 'leaflet';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent],
  template: `
    <div class="container">
      <button class="btn btn-ghost back-btn" routerLink="/orders">← As minhas encomendas</button>

      @if (isLoading) { <app-loading-spinner /> }
      @if (error) { <div class="alert alert-error">{{ error }}</div> }

      @if (order && !isLoading) {
        <div class="order-detail-layout">
          <!-- Left: order info -->
          <div class="order-info">
            <div class="card">
              <div class="order-top">
                <h2>Encomenda #{{ order._id.slice(-6).toUpperCase() }}</h2>
                <span class="badge" [class]="statusBadge(order.status)" [class.pulse]="order.status === 'delivering'">
                  {{ statusLabel(order.status) }}
                </span>
              </div>
              <p class="order-date">{{ order.createdAt | date:'dd/MM/yyyy HH:mm' }}</p>

              <!-- Status timeline -->
              <div class="timeline">
                @for (s of statusSteps; track s.key) {
                  <div class="tl-step" [class.done]="isStepDone(s.key)" [class.active]="order.status === s.key">
                    <div class="tl-dot"></div>
                    <span>{{ s.label }}</span>
                  </div>
                }
              </div>

              <div class="order-meta-grid">
                <div><label>Supermercado</label><span>{{ order.supermarketId?.name }}</span></div>
                <div><label>Método</label><span>{{ order.deliveryMethod === 'pickup' ? 'Pickup' : 'Entrega ao domicílio' }}</span></div>
                <div><label>Custo entrega</label><span>{{ order.deliveryCost | number:'1.2-2' }} €</span></div>
                <div><label>Total</label><span class="order-total">{{ order.total | number:'1.2-2' }} €</span></div>
              </div>

              <table style="margin-top:1rem">
                <thead><tr><th>Produto</th><th>Qtd</th><th>Preço</th><th>Subtotal</th></tr></thead>
                <tbody>
                  @for (item of order.items; track item.productId) {
                    <tr>
                      <td>{{ item.name }}</td>
                      <td>{{ item.quantity }}</td>
                      <td>{{ item.price | number:'1.2-2' }} €</td>
                      <td>{{ item.price * item.quantity | number:'1.2-2' }} €</td>
                    </tr>
                  }
                </tbody>
              </table>

              @if (canCancel) {
                <button class="btn btn-danger" style="margin-top:1rem" (click)="cancelOrder()">Cancelar encomenda</button>
              }
            </div>

            @if (countdown !== null) {
              <div class="card countdown-card">
                @if (countdown > 0) {
                  <p>Entrega estimada em <strong class="countdown">{{ formatCountdown(countdown) }}</strong></p>
                } @else {
                  <p class="arriving">A chegar ao seu destino!</p>
                }
              </div>
            }
          </div>

          <!-- Right: map -->
          <div class="map-col">
            @if (order.deliveryMethod === 'courier' && order.status === 'delivering') {
              @if (mapError) {
                <div class="alert alert-info">Tracking temporariamente indisponível.</div>
              } @else {
                <div id="order-map" class="order-map"></div>
              }
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .back-btn { margin: 1rem 0; }
    .order-detail-layout {
      display: grid;
      grid-template-columns: 1fr 420px;
      gap: 1.5rem;
      padding-bottom: 2rem;
      align-items: start;
    }
    @media (max-width: 768px) {
      .order-detail-layout { grid-template-columns: 1fr; }
      .map-col { display: none; }
    }
    .order-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: .3rem; }
    .order-date { color: var(--text-2); font-size: .84rem; margin-bottom: 1rem; }
    .timeline { display: flex; gap: 0; flex-wrap: wrap; margin: 1rem 0; }
    .tl-step {
      display: flex; align-items: center; gap: .3rem;
      color: var(--text-3); font-size: .8rem;
    }
    .tl-step + .tl-step::before { content: '→'; margin: 0 .3rem; color: var(--border-light); }
    .tl-step.done { color: var(--green); }
    .tl-step.active { color: var(--blue); font-weight: 600; }
    .tl-dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; }
    .order-meta-grid {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: .5rem; margin-top: 1rem;
    }
    .order-meta-grid label { display: block; color: var(--text-2); font-size: .78rem; margin-bottom: .1rem; }
    .order-total { color: var(--blue); font-weight: 700; }
    .order-map { height: 55vh; border-radius: var(--radius-lg); }
    .countdown-card { text-align: center; margin-top: 1rem; }
    .countdown { font-size: 1.6rem; color: var(--blue); font-family: var(--font-display); }
    .arriving { color: var(--green); font-size: 1.1rem; font-weight: 700; }
  `]
})
export class OrderDetailComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly orderService = inject(OrderService);
  private readonly mapService = inject(MapService);
  private readonly destroy$ = new Subject<void>();

  order?: Order;
  isLoading = true;
  error = '';
  mapError = false;
  countdown: number | null = null;

  private map?: L.Map;
  private pollInterval?: ReturnType<typeof setInterval>;
  private countdownInterval?: ReturnType<typeof setInterval>;

  readonly statusSteps = [
    { key: 'pending',    label: 'Pendente' },
    { key: 'confirmed',  label: 'Confirmado' },
    { key: 'preparing',  label: 'Em preparação' },
    { key: 'delivering', label: 'Em entrega' },
    { key: 'delivered',  label: 'Entregue' },
  ];

  get canCancel(): boolean {
    if (!this.order || this.order.status !== 'confirmed') return false;
    return Date.now() - new Date(this.order.confirmedAt).getTime() < 5 * 60 * 1000;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.loadOrder(id);

    this.pollInterval = setInterval(() => this.loadOrder(id), 30000);
  }

  loadOrder(id: string): void {
    this.orderService.getOrder(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: order => {
        const wasDelivering = this.order?.status === 'delivering';
        this.order = order;
        this.isLoading = false;
        if (order.status === 'delivering' && !wasDelivering) {
          setTimeout(() => this.initTracking(order), 200);
        }
      },
      error: () => {
        this.error = 'Encomenda não encontrada.';
        this.isLoading = false;
      }
    });
  }

  private initTracking(order: Order): void {
    if (!order.courierId) return;

    const smAddress = order.supermarketId?.address ?? '';
    const courierVehicle = order.courierId.vehicle ?? 'foot';

    forkJoin({
      clientCoords: this.mapService.getUserLocation().pipe(catchError(() => of(null))),
      smCoords: this.mapService.geocodeAddress(smAddress).pipe(catchError(() => of(null))),
    }).subscribe(({ clientCoords, smCoords }) => {
      if (!smCoords) { this.mapError = true; return; }

      const fallbackCoords: GeoCoords = smCoords;
      const courierCoords = fallbackCoords;

      const clientTarget: GeoCoords = clientCoords ?? smCoords;

      this.map = this.mapService.initMap('order-map', [smCoords.lat, smCoords.lng], 13);
      this.mapService.addMarker(this.map, smCoords.lat, smCoords.lng, `<strong>${order.supermarketId.name}</strong>`, '#3b82f6');
      if (clientCoords) {
        this.mapService.addMarker(this.map, clientCoords.lat, clientCoords.lng, 'A sua localização', '#10b981');
      }
      this.mapService.addMarker(this.map, courierCoords.lat, courierCoords.lng, `Estafeta: ${order.courierId!.name}`, '#fbbf24');
      this.mapService.drawRoute(this.map, [[smCoords.lat, smCoords.lng], [clientTarget.lat, clientTarget.lng]]);

      this.mapService.calculateTotalDeliveryTime(courierVehicle, courierCoords, smCoords, clientTarget)
        .pipe(catchError(() => of(null)))
        .subscribe(result => {
          if (!result || !order.confirmedAt) return;
          const estimatedArrival = new Date(order.confirmedAt).getTime() + result.totalSeconds * 1000;
          this.startCountdown(estimatedArrival);
        });
    });
  }

  private startCountdown(estimatedArrival: number): void {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
    this.countdownInterval = setInterval(() => {
      this.countdown = Math.max(0, Math.floor((estimatedArrival - Date.now()) / 1000));
    }, 1000);
  }

  formatCountdown(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
  }

  statusBadge(status: string): string {
    const map: Record<string, string> = {
      pending: 'badge-amber', confirmed: 'badge-blue', preparing: 'badge-amber',
      delivering: 'badge-cyan', delivered: 'badge-green', cancelled: 'badge-red'
    };
    return map[status] ?? 'badge-blue';
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      pending: 'Pendente', confirmed: 'Confirmado', preparing: 'Em preparação',
      delivering: 'Em entrega', delivered: 'Entregue', cancelled: 'Cancelado'
    };
    return map[status] ?? status;
  }

  isStepDone(key: string): boolean {
    const order = ['pending', 'confirmed', 'preparing', 'delivering', 'delivered'];
    const current = order.indexOf(this.order?.status ?? '');
    return current > order.indexOf(key);
  }

  cancelOrder(): void {
    if (!this.order || !confirm('Cancelar esta encomenda?')) return;
    this.orderService.updateStatus(this.order._id, 'cancelled')
      .pipe(takeUntil(this.destroy$))
      .subscribe({ next: o => { this.order = o; }, error: () => alert('Erro ao cancelar.') });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    clearInterval(this.pollInterval);
    if (this.countdownInterval) clearInterval(this.countdownInterval);
    this.map?.remove();
  }
}
