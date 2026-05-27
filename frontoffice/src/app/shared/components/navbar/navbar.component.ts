import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, AsyncPipe, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="nav-inner container">
        <a routerLink="/" class="nav-logo">🛒 Marketplace</a>

        <button class="hamburger" (click)="toggleMenu()" [class.open]="menuOpen" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>

        <ul class="nav-links" [class.open]="menuOpen" (click)="closeMenu()">
          <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Início</a></li>
          <li><a routerLink="/shop" routerLinkActive="active">Loja</a></li>

          @if (auth.isLoggedIn()) {
            <li>
              <a routerLink="/cart" routerLinkActive="active" class="cart-link">
                Carrinho
                @if ((cartCount$ | async); as count) {
                  @if (count > 0) { <span class="badge-count">{{ count }}</span> }
                }
              </a>
            </li>
            <li><a routerLink="/orders" routerLinkActive="active">Encomendas</a></li>
            <li><a routerLink="/profile" routerLinkActive="active">Perfil</a></li>
            <li class="user-info">Olá, {{ (auth.currentUser$ | async)?.name }}</li>
            <li><button class="btn btn-ghost btn-xs" (click)="logout()">Sair</button></li>
          } @else {
            <li><a routerLink="/auth/login" class="btn btn-ghost btn-xs">Entrar</a></li>
            <li><a routerLink="/auth/register" class="btn btn-primary btn-xs">Registar</a></li>
          }
        </ul>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: var(--bg-2);
      border-bottom: 1px solid var(--border);
      backdrop-filter: blur(12px);
    }
    .nav-inner {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      height: 60px;
    }
    .nav-logo {
      font-family: var(--font-display);
      font-weight: 800;
      font-size: 1.15rem;
      color: var(--text);
      text-decoration: none;
      white-space: nowrap;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: .25rem;
      list-style: none;
      margin-left: auto;
      flex-wrap: wrap;
    }
    .nav-links a, .nav-links button {
      color: var(--text-2);
      font-size: .88rem;
      padding: .35rem .65rem;
      border-radius: var(--radius);
      text-decoration: none;
      transition: color .2s, background .2s;
    }
    .nav-links a:hover, .nav-links a.active { color: var(--text); background: var(--bg-4); }
    .cart-link { position: relative; display: inline-flex; align-items: center; gap: .3rem; }
    .badge-count {
      background: var(--blue);
      color: #fff;
      border-radius: 999px;
      font-size: .68rem;
      font-weight: 700;
      padding: .05rem .4rem;
      line-height: 1.4;
    }
    .user-info { color: var(--text-2); font-size: .82rem; padding: 0 .5rem; }
    .btn-xs { padding: .3rem .75rem; font-size: .83rem; }
    .hamburger { display: none; flex-direction: column; gap: 4px; background: none; border: none; cursor: pointer; padding: .4rem; }
    .hamburger span { display: block; width: 22px; height: 2px; background: var(--text); border-radius: 2px; transition: transform .25s, opacity .25s; }

    @media (max-width: 768px) {
      .hamburger { display: flex; margin-left: auto; }
      .nav-links {
        display: none;
        position: absolute;
        top: 60px; left: 0; right: 0;
        background: var(--bg-2);
        border-bottom: 1px solid var(--border);
        flex-direction: column;
        align-items: flex-start;
        padding: 1rem 1.5rem;
        gap: .5rem;
      }
      .nav-links.open { display: flex; }
    }
  `]
})
export class NavbarComponent {
  readonly auth = inject(AuthService);
  private readonly cart = inject(CartService);
  readonly cartCount$ = this.cart.itemCount$;
  menuOpen = false;

  toggleMenu(): void { this.menuOpen = !this.menuOpen; }
  closeMenu(): void { this.menuOpen = false; }

  logout(): void {
    this.auth.logout();
    this.closeMenu();
  }
}
