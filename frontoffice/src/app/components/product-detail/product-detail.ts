import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

import { Product } from '../../models/product.model';
import { Supermarket } from '../../models/supermarket.model';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

/**
 * Detalhe de um produto. Para além das informações habituais, mostra a
 * **comparação de preços com o mesmo produto em outros supermercados** —
 * cumprindo o requisito do enunciado:
 *
 *   "O sistema deve permitir comparar preços do mesmo produto entre diferentes
 *    supermercados. Exemplo: Leite — Mercado A 0.89€ — Mercado B 0.95€"
 *
 * O endpoint /products/compare faz o match por nome com regex case-insensitive,
 * por isso "Leite" pode encontrar "Leite UHT 1L" — o ideal seria match exato
 * por nome normalizado. Ficamos com o comportamento do backend e mostramos
 * sempre o nome de cada match no preço comparado para deixar claro o que se
 * está a comparar.
 */
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatChipsModule,
    MatTableModule,
    MatTooltipModule,
  ],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly loading = signal(true);
  readonly product = signal<Product | null>(null);
  readonly compareLoading = signal(false);
  readonly comparisons = signal<Product[]>([]);
  readonly compareShown = signal(false);

  /** Colunas da tabela de comparação. */
  readonly compareCols = ['supermarket', 'product', 'price', 'action'];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/shop']);
      return;
    }

    this.productService.getById(id).subscribe({
      next: p => {
        this.product.set(p);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['/shop']);
      },
    });
  }

  /** Helper para obter o supermercado populado a partir do produto. */
  supermarketOf(p: Product): Pick<Supermarket, '_id' | 'name' | 'address' | 'deliveryMethods'> | null {
    if (typeof p.supermarketId === 'string') return null;
    return p.supermarketId;
  }

  /**
   * Botão "Comparar preços" — chama /products/compare?name=<nome do produto>.
   * O resultado inclui o produto atual; filtramos para mostrar só os outros.
   */
  compare(): void {
    const p = this.product();
    if (!p) return;

    this.compareShown.set(true);
    this.compareLoading.set(true);

    this.productService.compareByName(p.name).subscribe({
      next: results => {
        // Excluir o próprio produto desta página (mesmo _id)
        this.comparisons.set(results.filter(r => r._id !== p._id));
        this.compareLoading.set(false);
      },
      error: () => this.compareLoading.set(false),
    });
  }

  /**
   * Para a tabela de comparação: extrai o nome do supermercado de um
   * produto comparado (vem populado do endpoint /compare).
   */
  comparedSupermarketName(p: Product): string {
    return typeof p.supermarketId === 'string' ? '—' : p.supermarketId.name;
  }

  /**
   * Diferença de preço relativa ao produto atual.
   * Devolve número negativo se for mais barato, positivo se mais caro.
   */
  priceDiff(comparedPrice: number): number {
    const current = this.product()?.price ?? 0;
    return comparedPrice - current;
  }

  addToCart(): void {
    const p = this.product();
    if (!p) return;
    this.cartService.add(p._id, 1).subscribe();
  }
}
