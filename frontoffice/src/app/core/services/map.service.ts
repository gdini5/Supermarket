import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, from, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import * as L from 'leaflet';

export interface RouteResult {
  distance: number;
  duration: number;
  geometry: unknown;
}

export interface GeoCoords {
  lat: number;
  lng: number;
}

const geocodeCache = new Map<string, GeoCoords>();

@Injectable({ providedIn: 'root' })
export class MapService {
  private readonly http = inject(HttpClient);

  initMap(elementId: string, center: [number, number], zoom: number): L.Map {
    const map = L.map(elementId, { center, zoom });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(map);
    return map;
  }

  addMarker(map: L.Map, lat: number, lng: number, label: string, color = '#3b82f6'): L.Marker {
    const icon = L.divIcon({
      html: `<div style="background:${color};width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.5)"></div>`,
      className: '',
      iconSize: [14, 14],
      iconAnchor: [7, 7],
      popupAnchor: [0, -10]
    });
    return L.marker([lat, lng], { icon }).bindPopup(label).addTo(map);
  }

  drawRoute(map: L.Map, coords: [number, number][]): L.Polyline {
    return L.polyline(coords, { color: '#3b82f6', weight: 4, opacity: .8 }).addTo(map);
  }

  getRoute(profile: 'driving' | 'cycling' | 'foot', from: GeoCoords, to: GeoCoords): Observable<RouteResult> {
    const url = `${environment.osrmUrl}/${profile}/${from.lng},${from.lat};${to.lng},${to.lat}`;
    return this.http.get<{ routes: { distance: number; duration: number; geometry: unknown }[] }>(url, {
      params: new HttpParams().set('overview', 'full').set('geometries', 'geojson')
    }).pipe(
      map(res => ({
        distance: res.routes[0].distance,
        duration: res.routes[0].duration,
        geometry: res.routes[0].geometry
      }))
    );
  }

  vehicleToProfile(vehicle: string): 'driving' | 'cycling' | 'foot' {
    if (vehicle === 'bicycle') return 'cycling';
    if (vehicle === 'foot') return 'foot';
    return 'driving';
  }

  geocodeAddress(address: string): Observable<GeoCoords> {
    if (geocodeCache.has(address)) {
      return of(geocodeCache.get(address)!);
    }
    return this.http.get<{ lat: string; lon: string }[]>(
      `${environment.nominatimUrl}/search`,
      {
        params: new HttpParams().set('q', address).set('format', 'json').set('limit', '1'),
        headers: { 'User-Agent': 'MarketplaceFrontoffice/1.0' }
      }
    ).pipe(
      map(results => {
        if (!results.length) throw new Error('No results');
        const coords: GeoCoords = { lat: +results[0].lat, lng: +results[0].lon };
        geocodeCache.set(address, coords);
        return coords;
      })
    );
  }

  getUserLocation(): Observable<GeoCoords> {
    return from(new Promise<GeoCoords>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        err => reject(err)
      );
    }));
  }

  calculateTotalDeliveryTime(
    courierVehicle: string,
    courierCoords: GeoCoords,
    smCoords: GeoCoords,
    clientCoords: GeoCoords
  ): Observable<{ leg1: RouteResult; leg2: RouteResult; totalSeconds: number }> {
    const profile = this.vehicleToProfile(courierVehicle);
    return forkJoin({
      leg1: this.getRoute(profile, courierCoords, smCoords).pipe(catchError(() => of({ distance: 0, duration: 0, geometry: null } as RouteResult))),
      leg2: this.getRoute(profile, smCoords, clientCoords).pipe(catchError(() => of({ distance: 0, duration: 0, geometry: null } as RouteResult)))
    }).pipe(
      map(({ leg1, leg2 }) => ({ leg1, leg2, totalSeconds: leg1.duration + leg2.duration }))
    );
  }
}
