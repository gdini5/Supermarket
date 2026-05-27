import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as L from 'leaflet';

export interface Coords {
  lat: number;
  lng: number;
}

export interface RouteResult {
  distanceMeters: number;
  durationSeconds: number;
  geometry: GeoJSON.LineString;
}

// Fix Leaflet default marker icons (quebram com Webpack/Angular CLI)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

@Injectable({ providedIn: 'root' })
export class MapService {
  private readonly http = inject(HttpClient);
  private readonly geocodeCache = new Map<string, Coords>();

  initMap(elementId: string, center: [number, number] = [39.5, -8.0], zoom = 7): L.Map {
    const container = document.getElementById(elementId);
    if (container && (container as any)._leaflet_id) {
      (container as any)._leaflet_id = undefined;
    }

    const map = L.map(elementId, { center, zoom, zoomControl: true });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    return map;
  }

  addMarker(
    map: L.Map,
    coords: Coords,
    label: string,
    color: 'blue' | 'green' | 'red' | 'orange' = 'blue'
  ): L.Marker {
    const colorUrls: Record<string, string> = {
      blue:   'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      green:  'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      red:    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      orange: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    };

    const icon = L.icon({
      iconUrl:      colorUrls[color],
      shadowUrl:    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      iconSize:     [25, 41],
      iconAnchor:   [12, 41],
      popupAnchor:  [1, -34],
      shadowSize:   [41, 41],
    });

    return L.marker([coords.lat, coords.lng], { icon })
      .addTo(map)
      .bindPopup(label);
  }

  drawRoute(map: L.Map, coordinates: [number, number][], color = '#3b82f6'): L.Polyline {
    return L.polyline(coordinates, { color, weight: 4, opacity: 0.8 }).addTo(map);
  }

  geocodeAddress(address: string): Observable<Coords | null> {
    if (this.geocodeCache.has(address)) {
      return of(this.geocodeCache.get(address)!);
    }

    return this.http.get<any[]>('https://nominatim.openstreetmap.org/search', {
      params: {
        q:            address + ', Portugal',
        format:       'json',
        limit:        '1',
        countrycodes: 'pt',
      },
      headers: {
        'Accept-Language': 'pt',
        'User-Agent':      'PAW-Marketplace-App/1.0',
      },
    }).pipe(
      map(results => {
        if (!results?.length) return null;
        const coords: Coords = {
          lat: parseFloat(results[0].lat),
          lng: parseFloat(results[0].lon),
        };
        this.geocodeCache.set(address, coords);
        return coords;
      }),
      catchError(() => of(null)),
    );
  }

  getUserLocation(): Observable<Coords | null> {
    return new Observable(observer => {
      if (!navigator.geolocation) {
        observer.next(null);
        observer.complete();
        return;
      }
      navigator.geolocation.getCurrentPosition(
        pos => {
          observer.next({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          observer.complete();
        },
        () => {
          observer.next(null);
          observer.complete();
        },
        { timeout: 5000, maximumAge: 30000 },
      );
    });
  }

  getRoute(
    profile: 'driving' | 'cycling' | 'foot',
    from: Coords,
    to: Coords
  ): Observable<RouteResult | null> {
    const url = `https://router.project-osrm.org/route/v1/${profile}/${from.lng},${from.lat};${to.lng},${to.lat}`;
    return this.http.get<any>(url, {
      params: { overview: 'full', geometries: 'geojson' },
    }).pipe(
      map(res => {
        const route = res?.routes?.[0];
        if (!route) return null;
        return {
          distanceMeters:  route.distance  as number,
          durationSeconds: route.duration  as number,
          geometry:        route.geometry  as GeoJSON.LineString,
        };
      }),
      catchError(() => of(null)),
    );
  }

  calculateDeliveryTime(
    profile: 'driving' | 'cycling' | 'foot',
    courierCoords: Coords,
    smCoords: Coords,
    clientCoords: Coords
  ): Observable<{ leg1: RouteResult | null; leg2: RouteResult | null; totalSeconds: number }> {
    return forkJoin({
      leg1: this.getRoute(profile, courierCoords, smCoords),
      leg2: this.getRoute(profile, smCoords, clientCoords),
    }).pipe(
      map(({ leg1, leg2 }) => ({
        leg1,
        leg2,
        totalSeconds: (leg1?.durationSeconds ?? 0) + (leg2?.durationSeconds ?? 0),
      })),
    );
  }

  vehicleToProfile(vehicle?: string): 'driving' | 'cycling' | 'foot' {
    switch (vehicle) {
      case 'bicycle':    return 'cycling';
      case 'motorcycle': return 'driving';
      case 'car':        return 'driving';
      case 'foot':       return 'foot';
      default:           return 'driving';
    }
  }

  formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m`;
    return `${m}m`;
  }

  formatDistance(meters: number): string {
    if (meters < 1000) return `${Math.round(meters)}m`;
    return `${(meters / 1000).toFixed(1).replace('.', ',')} km`;
  }
}
