import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { Navbar } from './components/layout/navbar/navbar';

/**
 * Componente raiz da aplicação.
 * Esqueleto: navbar + área de rotas + rodapé.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, Navbar],
  template: `
    <app-navbar />
    <main class="app-main">
      <router-outlet />
    </main>
    <footer class="app-footer">
      <div class="foot-inner">
        <div class="foot-brand">
          <span class="foot-mark">M</span>
          <span>marketplace</span>
        </div>
        <p class="foot-tag">Mercados locais, entregues à porta.</p>
        <nav class="foot-links">
          <a routerLink="/">Início</a>
          <a routerLink="/shop">Loja</a>
        </nav>
      </div>
      <p class="foot-copy">© 2026 Marketplace · Projeto académico PAW · ESTG</p>
    </footer>
  `,
  styles: [
    `
      .app-main {
        min-height: calc(100vh - 68px);
        background: var(--bg-base);
      }
      .app-footer {
        background: var(--bg-surface);
        border-top: 1px solid var(--line);
        padding: 2.5rem clamp(1rem, 4vw, 3rem) 1.5rem;
      }
      .foot-inner {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        gap: 1.5rem;
        flex-wrap: wrap;
      }
      .foot-brand {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-family: var(--font-display);
        font-weight: 700;
        font-size: 1.25rem;
        color: var(--ink);
      }
      .foot-mark {
        display: grid;
        place-items: center;
        width: 32px;
        height: 32px;
        background: var(--lime);
        color: var(--lime-ink);
        font-weight: 700;
        border-radius: 9px;
        
      }
      .foot-tag {
        color: var(--ink-soft);
        font-size: 0.95rem;
      }
      .foot-links {
        margin-left: auto;
        display: flex;
        gap: 1.3rem;
      }
      .foot-links a {
        color: var(--ink-soft);
        font-weight: 500;
      }
      .foot-links a:hover {
        color: var(--lime);
      }
      .foot-copy {
        max-width: 1200px;
        margin: 1.5rem auto 0;
        padding-top: 1.5rem;
        border-top: 1px solid var(--line);
        color: var(--ink-faint);
        font-size: 0.82rem;
      }
    `,
  ],
})
export class App {}
