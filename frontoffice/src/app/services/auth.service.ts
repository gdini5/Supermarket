import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, of, tap, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';
import { AuthUser, User } from '../models/user.model';

const TOKEN_KEY = 'paw_token';
const USER_KEY = 'paw_user';

/**
 * Centraliza tudo o que diz respeito a autenticação:
 *  - guarda o JWT em localStorage
 *  - expõe o utilizador atual como signal reativo (consumido pelo navbar)
 *  - login, registo, logout
 *  - revalidação da sessão no arranque da app (chamada `/auth/me`)
 *
 * IMPORTANTE: este serviço é usado pelo frontoffice, que é exclusivo de
 * clientes finais. Se um utilizador com role diferente de 'client' tentar
 * fazer login, a sessão é descartada e devolvido um erro.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  /** Signal interno com o utilizador autenticado (ou null). */
  private readonly _currentUser = signal<AuthUser | null>(this.readUserFromStorage());

  /** Signal só de leitura para os componentes consumirem. */
  readonly currentUser = this._currentUser.asReadonly();

  /** Boolean derivado — útil em `*ngIf="auth.isAuthenticated()"`. */
  readonly isAuthenticated = computed(() => this._currentUser() !== null);

  /** Token JWT atual (lido sempre do localStorage para sobreviver a refresh). */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Login. Se o utilizador autenticar mas não for cliente, a sessão é
   * imediatamente descartada — o frontoffice é só para clientes finais.
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, credentials).pipe(
      tap(res => {
        if (res.user.role !== 'client') {
          // Não persistir nada — devolver erro síncrono via throwError abaixo
          throw new Error('Esta área é exclusiva para clientes finais. Use o backoffice.');
        }
        this.persistSession(res.token, res.user);
      }),
      catchError(err => {
        // Se o erro é o nosso (role inválida), propagar com mensagem clara
        if (err instanceof Error) {
          return throwError(() => ({ error: { error: err.message } }));
        }
        return throwError(() => err);
      }),
    );
  }

  /**
   * Registo. Force-fix role='client' — qualquer outro role devia ser registado
   * via backoffice. Devolve o utilizador já autenticado.
   */
  register(data: Omit<RegisterRequest, 'role'>): Observable<AuthResponse> {
    const payload: RegisterRequest = { ...data, role: 'client' };
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, payload).pipe(
      tap(res => this.persistSession(res.token, res.user)),
    );
  }

  /**
   * Logout. JWT é stateless — o servidor não guarda sessão para invalidar.
   * Limpamos o token localmente e mandamos o utilizador para o login.
   *
   * Nota: existe um endpoint /auth/logout no backend, mas como ele só devolve
   * uma mensagem (não invalida nada), não vale a pena chamá-lo. Se mais tarde
   * adicionarmos blacklist de tokens, fazemos a chamada aqui.
   */
  logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  /**
   * Revalida a sessão no arranque da app. Se o token expirou ou foi revogado,
   * o servidor responde 401 e o ErrorInterceptor trata de limpar.
   */
  loadCurrentUser(): Observable<User | null> {
    if (!this.getToken()) return of(null);

    return this.http.get<User>(`${this.baseUrl}/me`).pipe(
      tap(user => {
        // Se entretanto o role no servidor já não é client, descartar sessão
        if (user.role !== 'client') {
          this.clearSession();
        }
      }),
      catchError(() => {
        this.clearSession();
        return of(null);
      }),
    );
  }

  /** Limpa tudo — chamado pelo logout e pelo ErrorInterceptor em 401. */
  clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._currentUser.set(null);
  }

  /** Busca o perfil completo do utilizador (GET /auth/me). */
  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/me`);
  }

  /**
   * Atualiza o perfil (nome, telefone, morada) via PUT /auth/me.
   * Atualiza também o nome no signal local para o navbar refletir logo.
   */
  updateProfile(data: { name?: string; phone?: string; address?: string }): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/me`, data).pipe(
      tap(user => {
        const current = this._currentUser();
        if (current) {
          const updated: AuthUser = { ...current, name: user.name };
          localStorage.setItem(USER_KEY, JSON.stringify(updated));
          this._currentUser.set(updated);
        }
      }),
    );
  }

  // ── Privados ────────────────────────────────────────────────────────────

  private persistSession(token: string, user: AuthUser): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this._currentUser.set(user);
  }

  private readUserFromStorage(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }
}
