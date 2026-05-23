import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <div class="container">
        <span>© {{ year }} Marketplace — Supermercados Locais</span>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--bg-2);
      border-top: 1px solid var(--border);
      padding: 1.2rem 0;
      text-align: center;
      color: var(--text-3);
      font-size: .85rem;
    }
  `]
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
}
