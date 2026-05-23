import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Navbar } from './components/layout/navbar/navbar';

/**
 * Componente raiz da aplicação.
 * Define o esqueleto: barra de navegação + área onde as rotas renderizam.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar],
  template: `
    <app-navbar />
    <main class="app-main">
      <router-outlet />
    </main>
  `,
  styles: [`
    .app-main {
      min-height: calc(100vh - 64px);
      background: var(--mat-sys-surface);
    }
  `],
})
export class App {}
