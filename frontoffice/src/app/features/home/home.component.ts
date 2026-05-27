import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin, of, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { SupermarketService } from '../../core/services/supermarket.service';
import { MapService } from '../../core/services/map.service';
import { Supermarket } from '../../core/models/supermarket.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import * as L from 'leaflet';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>Supermercados Perto de Si</h1>
        <p class="sub">Descubra os melhores produtos locais e faça as suas compras online.</p>
      </div>

      @if (isLoading) { <app-loading-spinner /> }

      @if (error) {
        <div class="alert alert-error">{{ error }}</div>
      }

      @if (!isLoading && !error) {
        <div class="home-layout">
          <!-- Supermarket list -->
          <div class="sm-list">
            @for (sm of supermarkets; track sm._id) {
              <div class="sm-card card"
                   [class.highlighted]="highlighted === sm._id"
                   (mouseenter)="highlight(sm._id)"
                   (mouseleave)="highlight(null)"
                   (click)="goToShop(sm._id)">
                <h3>{{ sm.name }}</h3>
                @if (sm.description) { <p class="desc">{{ sm.description }}</p> }
                <p class="addr">📍 {{ sm.address }}</p>
                @if (sm.schedule) { <p class="sch">🕐 {{ sm.schedule }}</p> }
                <div class="delivery-badges">
                  @for (dm of sm.deliveryMethods; track dm.type) {
                    @if (dm.type === 'pickup') {
                      <span class="badge badge-green">Pickup disponível</span>
                    }
                    @if (dm.type === 'courier') {
                      <span class="badge badge-cyan">Entrega ao domicílio — {{ dm.cost > 0 ? dm.cost + ' €' : 'Grátis' }}</span>
                    }
                  }
                </div>
                <button class="btn btn-primary btn-sm" (click)="goToShop(sm._id); $event.stopPropagation()">
                  Ver produtos →
                </button>
              </div>
            }
            @if (supermarkets.length === 0) {
              <div class="empty-state">
                <h3>Nenhum supermercado disponível</h3>
                <p>Ainda não existem supermercados aprovados.</p>
              </div>
            }
          </div>

          <!-- Map -->
          <div class="map-wrap">
            <div id="home-map" class="home-map"></div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .sub { color: var(--text-2); margin-top: .3rem; }
    .home-layout {
      display: grid;
      grid-template-columns: 40% 1fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
      align-items: start;
    }
    @media (max-width: 768px) {
      .home-layout { grid-template-columns: 1fr; }
      .map-wrap { display: none; }
    }
    .sm-list { display: flex; flex-direction: column; gap: 1rem; max-height: 80vh; overflow-y: auto; padding-right: .5rem; }
    .sm-card {
      cursor: pointer;
      transition: border-color .2s, transform .2s;
      display: flex;
      flex-direction: column;
      gap: .4rem;
    }
    .sm-card:hover, .sm-card.highlighted { border-color: var(--blue); transform: translateX(4px); }
    .desc { color: var(--text-2); font-size: .88rem; }
    .addr, .sch { color: var(--text-3); font-size: .82rem; }
    .delivery-badges { display: flex; gap: .4rem; flex-wrap: wrap; margin: .3rem 0; }
    .btn-sm { padding: .4rem .9rem; font-size: .83rem; align-self: flex-start; }
    .home-map { height: 75vh; border-radius: var(--radius-lg); }
    .map-wrap { position: sticky; top: 80px; }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly smService = inject(SupermarketService);
  private readonly mapService = inject(MapService);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  supermarkets: Supermarket[] = [];
  isLoading = true;
  error = '';
  highlighted: string | null = null;
  private map?: L.Map;
  private markers = new Map<string, L.Marker>();

  ngOnInit(): void {
    this.smService.getSupermarkets().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: sms => {
        this.supermarkets = sms;
        this.isLoading = false;
        setTimeout(() => this.initMap(), 100);
      },
      error: () => {
        this.error = 'Erro ao carregar supermercados.';
        this.isLoading = false;
      }
    });
  }

  private initMap(): void {
    this.map = this.mapService.initMap('home-map', [39.5, -8.0], 7);

    this.mapService.getUserLocation().pipe(
      catchError(() => of(null))
    ).subscribe(loc => {
      if (loc && this.map) {
        this.mapService.addMarker(this.map, loc.lat, loc.lng, 'A sua localização', '#10b981');
      }
    });

    // Geocode with throttling (max 1/s for Nominatim)
    this.supermarkets.forEach((sm, i) => {
      setTimeout(() => {
        this.mapService.geocodeAddress(sm.address).pipe(
          catchError(() => of(null))
        ).subscribe(coords => {
          if (!coords || !this.map) return;
          sm.lat = coords.lat;
          sm.lng = coords.lng;
          const popup = `<strong>${sm.name}</strong><br><a href="/shop/${sm._id}" style="color:var(--blue)">Ver produtos</a>`;
          const marker = this.mapService.addMarker(this.map, coords.lat, coords.lng, popup);
          this.markers.set(sm._id, marker);
        });
      }, i * 1100);
    });
  }

  highlight(id: string | null): void {
    this.highlighted = id;
    if (id && this.markers.has(id)) {
      this.markers.get(id)!.openPopup();
    }
  }

  goToShop(id: string): void {
    this.router.navigate(['/shop', id]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.map?.remove();
  }
}
