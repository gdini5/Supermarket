import { Component, AfterViewInit, OnDestroy, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { Subject, from, concatMap, delay, of, switchMap, map, takeUntil } from 'rxjs';
import * as L from 'leaflet';

import { Supermarket } from '../../models/supermarket.model';
import { SupermarketService } from '../../services/supermarket.service';
import { MapService, Coords } from '../../services/map.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements AfterViewInit, OnDestroy {
  private readonly supermarketService = inject(SupermarketService);
  private readonly mapService = inject(MapService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly supermarkets = signal<Supermarket[]>([]);
  readonly searchTerm = signal('');

  private map?: L.Map;
  private readonly smMarkers = new Map<string, L.Marker>();
  private readonly geocodedCoords = signal<Map<string, Coords>>(new Map());
  private readonly destroy$ = new Subject<void>();

  readonly filtered = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) return this.supermarkets();
    return this.supermarkets().filter(s =>
      s.name.toLowerCase().includes(term) ||
      s.address.toLowerCase().includes(term),
    );
  });

  constructor() {
    this.supermarketService.list().subscribe({
      next: list => {
        this.supermarkets.set(list);
        this.loading.set(false);
        this.startGeocoding(list);
      },
      error: () => {
        this.error.set('Não foi possível carregar os supermercados.');
        this.loading.set(false);
      },
    });

    // Reactively update map markers whenever filtered list or geocoded coords change
    effect(() => {
      this.updateMarkers(this.filtered(), this.geocodedCoords());
    });
  }

  ngAfterViewInit(): void {
    this.map = this.mapService.initMap('supermarket-map', [39.5, -8.0], 6);

    this.mapService.getUserLocation().subscribe(loc => {
      if (loc && this.map) {
        this.mapService.addMarker(this.map, loc, 'A tua localização', 'green');
      }
    });

    // Render any markers that were already geocoded before the map was ready
    this.updateMarkers(this.filtered(), this.geocodedCoords());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }
  }

  private startGeocoding(list: Supermarket[]): void {
    from(list).pipe(
      // 1.1 s between requests to respect Nominatim rate limit (1 req/s)
      concatMap(sm =>
        of(sm).pipe(
          delay(1100),
          switchMap(() =>
            this.mapService.geocodeAddress(sm.address).pipe(
              map(coords => ({ sm, coords }))
            )
          )
        )
      ),
      takeUntil(this.destroy$),
    ).subscribe(({ sm, coords }) => {
      if (!coords) return;
      const updated = new Map(this.geocodedCoords());
      updated.set(sm._id, coords);
      this.geocodedCoords.set(updated);
    });
  }

  private updateMarkers(visible: Supermarket[], coords: Map<string, Coords>): void {
    if (!this.map) return;

    // Remove markers for supermarkets no longer visible
    const visibleIds = new Set(visible.map(s => s._id));
    for (const [id, marker] of this.smMarkers) {
      if (!visibleIds.has(id)) {
        marker.remove();
        this.smMarkers.delete(id);
      }
    }

    // Add markers for newly visible supermarkets that have been geocoded
    for (const sm of visible) {
      if (this.smMarkers.has(sm._id)) continue;
      const c = coords.get(sm._id);
      if (!c) continue;
      const popup = `<strong>${sm.name}</strong><br><small>${sm.address}</small>`;
      const marker = this.mapService.addMarker(this.map, c, popup, 'blue');
      this.smMarkers.set(sm._id, marker);
    }
  }

  deliverySummary(s: Supermarket): string {
    if (!s.deliveryMethods?.length) return 'Métodos de entrega por definir';
    const labels = s.deliveryMethods.map(m =>
      m.type === 'courier' ? 'Entrega ao domicílio' : 'Levantamento em loja',
    );
    return labels.join(' · ');
  }
}
