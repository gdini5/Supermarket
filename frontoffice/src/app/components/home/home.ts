import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';

import { Supermarket } from '../../models/supermarket.model';
import { SupermarketService } from '../../services/supermarket.service';

/**
 * Página inicial do frontoffice: lista de supermercados aprovados.
 * O cliente clica num supermercado → vai para /shop com filtro pré-aplicado.
 *
 * Também tem uma pesquisa rápida por nome/morada para chegar a um
 * supermercado específico quando a lista cresce.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly supermarketService = inject(SupermarketService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly supermarkets = signal<Supermarket[]>([]);
  readonly searchTerm = signal('');

  /**
   * Filtragem client-side: como a lista de supermercados é pequena (são poucos
   * por design), não vale a pena ir ao servidor outra vez por cada tecla.
   */
  readonly filtered = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) return this.supermarkets();
    return this.supermarkets().filter(s =>
      s.name.toLowerCase().includes(term) ||
      s.address.toLowerCase().includes(term),
    );
  });

  constructor() {
    this.supermarketService.list().subscribe({
      next: list => {
        this.supermarkets.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Não foi possível carregar os supermercados.');
        this.loading.set(false);
      },
    });
  }

  /**
   * Devolve um sumário dos métodos de entrega para mostrar no card.
   * Ex.: "Entrega ao domicílio · Levantamento em loja"
   */
  deliverySummary(s: Supermarket): string {
    if (!s.deliveryMethods?.length) return 'Métodos de entrega por definir';
    const labels = s.deliveryMethods.map(m =>
      m.type === 'courier' ? 'Entrega ao domicílio' : 'Levantamento em loja',
    );
    return labels.join(' · ');
  }
}
