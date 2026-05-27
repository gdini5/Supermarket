import { Component, OnInit, OnDestroy, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { interval, Subscription, switchMap, startWith } from 'rxjs';
import * as L from 'leaflet';

import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { MapService } from '../../services/map.service';
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
  private readonly mapService = inject(MapService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly loading = signal(true);
  readonly order = signal<Order | null>(null);
  readonly routeInfo = signal<{ distance: string; duration: string } | null>(null);
  readonly countdown = signal('--:--');

  private pollingSub?: Subscription;
  private map?: L.Map;
  private countdownInterval?: ReturnType<typeof setInterval>;
  private trackingInitialized = false;

  readonly canCancel = computed(() => {
    const o = this.order();
    if (!o) return false;
    return canCancelOrder(o);
  });

  readonly statusSteps = [
    { id: 'pending',    label: 'Pendente',        icon: 'schedule' },
    { id: 'confirmed',  label: 'Confirmada',       icon: 'check_circle' },
    { id: 'preparing',  label: 'Em Preparação',    icon: 'restaurant' },
    { id: 'delivering', label: 'Em Entrega',        icon: 'local_shipping' },
    { id: 'delivered',  label: 'Entregue',          icon: 'home' }
  ];

  constructor() {
    // When order becomes 'delivering', initialise tracking map after Angular renders the div
    effect(() => {
      const o = this.order();
      if (
        o?.status === 'delivering' &&
        o?.deliveryMethod === 'courier' &&
        !this.trackingInitialized
      ) {
        this.trackingInitialized = true;
        setTimeout(() => this.initTrackingMap(o), 100);
      }
    });
  }

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
    if (this.countdownInterval) clearInterval(this.countdownInterval);
    if (this.map) { this.map.remove(); this.map = undefined; }
  }

  private initTrackingMap(order: Order): void {
    const smAddress = order.supermarketId?.address;
    if (!smAddress) return;

    this.map = this.mapService.initMap('tracking-map', [39.5, -8.0], 12);

    // Geocode supermarket address, get user GPS in parallel
    const sm$ = this.mapService.geocodeAddress(smAddress);
    const user$ = this.mapService.getUserLocation();

    sm$.subscribe(smCoords => {
      if (!smCoords || !this.map) return;
      this.mapService.addMarker(this.map, smCoords, `<strong>${order.supermarketId?.name}</strong>`, 'blue');

      user$.subscribe(clientCoords => {
        if (!clientCoords || !this.map) return;
        this.mapService.addMarker(this.map, clientCoords, 'A tua localização', 'green');

        this.map.fitBounds([
          [smCoords.lat, smCoords.lng],
          [clientCoords.lat, clientCoords.lng],
        ], { padding: [40, 40] });

        // Draw route and calculate ETA
        this.mapService.getRoute('driving', smCoords, clientCoords).subscribe(result => {
          if (!result || !this.map) return;

          const coords = result.geometry.coordinates.map(
            ([lng, lat]: number[]) => [lat, lng] as [number, number]
          );
          this.mapService.drawRoute(this.map, coords);

          this.routeInfo.set({
            distance: this.mapService.formatDistance(result.distanceMeters),
            duration:  this.mapService.formatDuration(result.durationSeconds),
          });

          this.startCountdown(result.durationSeconds, order.confirmedAt);
        });
      });
    });
  }

  private startCountdown(totalSeconds: number, confirmedAt: string): void {
    const arrival = new Date(confirmedAt).getTime() + totalSeconds * 1000;

    this.countdownInterval = setInterval(() => {
      const remaining = Math.max(0, arrival - Date.now());
      if (remaining === 0) {
        this.countdown.set('A chegar!');
        clearInterval(this.countdownInterval);
        return;
      }
      const m = Math.floor(remaining / 60000);
      const s = Math.floor((remaining % 60000) / 1000);
      this.countdown.set(`${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
    }, 1000);
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
