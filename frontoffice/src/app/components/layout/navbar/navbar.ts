import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';

import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';

/**
 * Toolbar principal. Mostra:
 *  - Logo + ligações principais (Início, Loja)
 *  - Quando deslogado: botões "Entrar" e "Registar"
 *  - Quando logado: nome do utilizador + menu (Encomendas, Sair) + ícone de carrinho
 *
 * Os links /cart e /orders são da responsabilidade do colega — quando esses
 * componentes existirem, os botões já passam a funcionar automaticamente.
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
    MatBadgeModule,
  ],
  template: `
    <mat-toolbar color="primary" class="navbar">
      <a routerLink="/" class="brand">
        <mat-icon>storefront</mat-icon>
        <span>Marketplace</span>
      </a>

      <nav class="nav-links">
        <a mat-button routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
          Início
        </a>
        <a mat-button routerLink="/shop" routerLinkActive="active">
          Loja
        </a>
      </nav>

      <span class="spacer"></span>

      @if (auth.isAuthenticated()) {
        <a mat-icon-button routerLink="/cart" aria-label="Carrinho" matTooltip="Carrinho"
           [matBadge]="cart.cartCount()"
           [matBadgeHidden]="cart.cartCount() === 0"
           matBadgeColor="warn">
          <mat-icon>shopping_cart</mat-icon>
        </a>

        <button mat-button [matMenuTriggerFor]="userMenu" class="user-btn">
          <mat-icon>account_circle</mat-icon>
          <span class="user-name">{{ auth.currentUser()?.name }}</span>
          <mat-icon>arrow_drop_down</mat-icon>
        </button>

        <mat-menu #userMenu="matMenu">
          <a mat-menu-item routerLink="/profile">
            <mat-icon>person</mat-icon>
            <span>O meu perfil</span>
          </a>
          <a mat-menu-item routerLink="/orders">
            <mat-icon>receipt_long</mat-icon>
            <span>As minhas encomendas</span>
          </a>
          <mat-divider />
          <button mat-menu-item (click)="auth.logout()">
            <mat-icon>logout</mat-icon>
            <span>Terminar sessão</span>
          </button>
        </mat-menu>
      } @else {
        <a mat-button routerLink="/login">Entrar</a>
        <a mat-stroked-button routerLink="/register" class="register-btn">Registar</a>
      }
    </mat-toolbar>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 100;
      gap: 1rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: inherit;
      text-decoration: none;
      font-weight: 600;
      font-size: 1.15rem;
      margin-right: 1.5rem;

      mat-icon {
        font-size: 1.6rem;
        width: 1.6rem;
        height: 1.6rem;
      }
    }

    .nav-links {
      display: flex;
      gap: 0.25rem;

      a.active {
        background: rgba(255, 255, 255, 0.15);
      }
    }

    .spacer {
      flex: 1;
    }

    .user-btn {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .user-name {
      max-width: 140px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .register-btn {
      margin-left: 0.5rem;
    }

    @media (max-width: 600px) {
      .nav-links a span,
      .user-name {
        display: none;
      }
    }
  `],
})
export class Navbar {
  readonly auth = inject(AuthService);
  readonly cart = inject(CartService);
}
