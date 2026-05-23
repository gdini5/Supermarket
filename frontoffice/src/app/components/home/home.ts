import { Component, OnDestroy, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';

import { Supermarket } from '../../models/supermarket.model';
import { SupermarketService } from '../../services/supermarket.service';

// Leaflet é carregado via CDN no index.html — declaramos o global L.
declare const L: any;

/**
 * Página inicial — identidade "Mercado Elétrico".
 * Hero + ticker + MAPA dos supermercados (bonificação) + grelha.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, RouterLink, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnDestroy {
  private readonly supermarketService = inject(SupermarketService);
  private readonly router = inject(Router);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly supermarkets = signal<Supermarket[]>([]);
  readonly searchTerm = signal('');

  private map: any = null;
  private markers: any[] = [];

  readonly filtered = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) return this.supermarkets();
    return this.supermarkets().filter(
      (s) => s.name.toLowerCase().includes(term) || s.address.toLowerCase().includes(term),
    );
  });

  /** Supermercados que têm coordenadas (para o mapa). */
  readonly withLocation = computed(() =>
    this.supermarkets().filter((s) => s.location?.lat != null && s.location?.lng != null),
  );

  constructor() {
    this.supermarketService.list().subscribe({
      next: (list) => {
        this.supermarkets.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Não foi possível carregar os supermercados.');
        this.loading.set(false);
      },
    });

    // O mapa só pode ser inicializado DEPOIS de os dados chegarem, porque a
    // secção do mapa está dentro de um @if (withLocation().length > 0) — só
    // então o elemento #homeMap existe no DOM. Este effect reage aos dados.
    effect(() => {
      const markets = this.withLocation();
      if (markets.length === 0) return;

      // Esperar pelo Leaflet (CDN) e pelo elemento #homeMap no DOM.
      this.whenReady(() => {
        if (!this.map) this.initMap();
        this.renderMarkers(markets);
      });
    });
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  /**
   * Espera que (1) o Leaflet esteja carregado e (2) o elemento #homeMap
   * exista no DOM com dimensões, antes de correr o callback.
   */
  private whenReady(cb: () => void, attempts = 0): void {
    const el = document.getElementById('homeMap');
    const leafletReady = typeof L !== 'undefined';
    if (leafletReady && el && el.offsetHeight > 0) {
      cb();
      return;
    }
    if (attempts > 60) return; // ~6s, desiste em silêncio
    setTimeout(() => this.whenReady(cb, attempts + 1), 100);
  }

  private initMap(): void {
    const el = document.getElementById('homeMap');
    if (!el || typeof L === 'undefined') return;

    this.map = L.map(el, { scrollWheelZoom: false }).setView([41.37, -8.19], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(this.map);

    // Forçar recálculo do tamanho depois de o layout estabilizar.
    setTimeout(() => this.map && this.map.invalidateSize(), 200);
  }

  private renderMarkers(markets: Supermarket[]): void {
    if (!this.map) return;

    // Limpar pins antigos
    this.markers.forEach((m) => this.map.removeLayer(m));
    this.markers = [];

    const bounds: [number, number][] = [];

    markets.forEach((sm) => {
      const lat = sm.location!.lat!;
      const lng = sm.location!.lng!;

      const icon = L.divIcon({
        className: 'fresco-pin',
        html: `<div class="pin-inner"></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      });

      const marker = L.marker([lat, lng], { icon }).addTo(this.map);
      const popupHtml = `
        <div class="map-popup">
          <strong>${sm.name}</strong>
          <span>${sm.address}</span>
          <a href="/shop?supermarketId=${sm._id}" class="popup-btn">Ver produtos</a>
        </div>`;
      marker.bindPopup(popupHtml);
      this.markers.push(marker);
      bounds.push([lat, lng]);
    });

    if (bounds.length === 1) {
      this.map.setView(bounds[0], 14);
    } else if (bounds.length > 1) {
      this.map.fitBounds(bounds, { padding: [40, 40] });
    }

    // Recalcular tamanho após adicionar os pins (garante tiles visíveis).
    setTimeout(() => this.map && this.map.invalidateSize(), 100);
  }

  initials(name: string): string {
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w.charAt(0))
      .join('')
      .toUpperCase();
  }

  hasCourier(s: Supermarket): boolean {
    return !!s.deliveryMethods?.some((m) => m.type === 'courier');
  }

  deliverySummary(s: Supermarket): string {
    if (!s.deliveryMethods?.length) return 'Entrega por definir';
    return s.deliveryMethods
      .map((m) => (m.type === 'courier' ? 'Domicílio' : 'Levantamento'))
      .join(' · ');
  }
}
