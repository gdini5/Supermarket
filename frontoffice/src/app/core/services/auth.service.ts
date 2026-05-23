import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, AuthResponse } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly base = `${environment.apiUrl}/auth`;

  private _currentUser$ = new BehaviorSubject<User | null>(this.loadUserFromStorage());
  readonly currentUser$ = this._currentUser$.asObservable();

  private loadUserFromStorage(): User | null {
    try {
      const raw = localStorage.getItem('mp_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/login`, { email, password }).pipe(
      tap(res => {
        localStorage.setItem('mp_token', res.token);
        localStorage.setItem('mp_user', JSON.stringify(res.user));
        this._currentUser$.next(res.user);
      })
    );
  }

  register(data: {
    name: string; email: string; password: string;
    address: string; phone: string; role: string; vehicle?: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/register`, data).pipe(
      tap(res => {
        localStorage.setItem('mp_token', res.token);
        localStorage.setItem('mp_user', JSON.stringify(res.user));
        this._currentUser$.next(res.user);
      })
    );
  }

  logout(): void {
    this.http.post(`${this.base}/logout`, {}).subscribe({ error: () => {} });
    localStorage.removeItem('mp_token');
    localStorage.removeItem('mp_user');
    this._currentUser$.next(null);
    this.router.navigate(['/']);
  }

  me(): Observable<User> {
    return this.http.get<User>(`${this.base}/me`).pipe(
      tap(user => {
        localStorage.setItem('mp_user', JSON.stringify(user));
        this._currentUser$.next(user);
      })
    );
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    return !this.isTokenExpired(token);
  }

  getToken(): string | null {
    return localStorage.getItem('mp_token');
  }

  getCurrentUser(): User | null {
    return this._currentUser$.getValue();
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  clearAuth(): void {
    localStorage.removeItem('mp_token');
    localStorage.removeItem('mp_user');
    this._currentUser$.next(null);
  }
}
