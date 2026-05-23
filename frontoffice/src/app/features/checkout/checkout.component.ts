import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { SupermarketService } from '../../core/services/supermarket.service';
import { DeliveryMethod } from '../../core/models/supermarket.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { PriceUnitPipe } from '../../shared/pipes/price-unit.pipe';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, AsyncPipe, FormsModule, LoadingSpinnerComponent, PriceUnitPipe],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>Finalizar Encomenda</h1>
      </div>

      <!-- Stepper -->
      <div class="stepper">
        <div class="step" [class.active]="step >= 1" [class.done]="step > 1">
          <div class="step-num">1</div><span>Resumo</span>
        </div>
        <div class="step-line"></div>
        <div class="step" [class.active]="step >= 2" [class.done]="step > 2">
          <div class="step-num">2</div><span>Entrega</span>
        </div>
        <div class="step-line"></div>
        <div class="step" [class.active]="step >= 3">
          <div class="step-num">3</div><span>Confirmar</span>
        </div>
      </div>

      @if (error) { <div class="alert alert-error">{{ error }}</div> }

      <!-- Step 1: Cart summary -->
      @if (step === 1) {
        <div class="card">
          <h2>Resumo do carrinho</h2>
          <table>
            <thead><tr><th>Produto</th><th>Qtd</th><th>Subtotal</th></tr></thead>
            <tbody>
              @for (item of (cartService.items$ | async); track item.productId._id) {
                <tr>
                  <td>{{ item.productId.name }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>{{ item.productId.price * item.quantity | number:'1.2-2' }} €</td>
                </tr>
              }
            </tbody>
          </table>
          <div class="total-row">
            <strong>Total produtos: {{ (cartService.total$ | async) | number:'1.2-2' }} €</strong>
          </div>
          <button class="btn btn-primary mt" (click)="step = 2; loadDelivery()">Escolher entrega →</button>
        </div>
      }

      <!-- Step 2: Delivery method -->
      @if (step === 2) {
        <div class="card">
          <h2>Método de entrega</h2>
          @if (loadingDelivery) { <app-loading-spinner /> }
          @else {
            @if (deliveryMethods.length === 0) {
              <div class="alert alert-info">Este supermercado não tem métodos de entrega configurados.</div>
            } @else {
              <div class="delivery-options">
                @for (dm of deliveryMethods; track dm.type) {
                  <label class="delivery-option" [class.selected]="selectedMethod === dm.type">
                    <input type="radio" name="delivery" [value]="dm.type" [(ngModel)]="selectedMethod">
                    <div class="delivery-info">
                      <strong>{{ dm.type === 'pickup' ? 'Recolha na loja (Pickup)' : 'Entrega ao domicílio' }}</strong>
                      <span>{{ dm.cost > 0 ? dm.cost + ' €' : 'Grátis' }}</span>
                    </div>
                  </label>
                }
              </div>
              <div class="total-row">
                <strong>Total: {{ totalWithDelivery | number:'1.2-2' }} €</strong>
              </div>
              <div class="step-actions">
                <button class="btn btn-ghost" (click)="step = 1">← Voltar</button>
                <button class="btn btn-primary" [disabled]="!selectedMethod" (click)="step = 3">Confirmar dados →</button>
              </div>
            }
          }
        </div>
      }

      <!-- Step 3: Confirm -->
      @if (step === 3) {
        <div class="card">
          <h2>Confirmar encomenda</h2>
          <table>
            <thead><tr><th>Produto</th><th>Qtd</th><th>Subtotal</th></tr></thead>
            <tbody>
              @for (item of (cartService.items$ | async); track item.productId._id) {
                <tr>
                  <td>{{ item.productId.name }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>{{ item.productId.price * item.quantity | number:'1.2-2' }} €</td>
                </tr>
              }
            </tbody>
          </table>
          <div class="summary-info">
            <div class="summary-row">
              <span>Método de entrega</span>
              <strong>{{ selectedMethod === 'pickup' ? 'Pickup' : 'Entrega ao domicílio' }}</strong>
            </div>
            <div class="summary-row">
              <span>Custo de entrega</span>
              <strong>{{ deliveryCost | number:'1.2-2' }} €</strong>
            </div>
            <div class="summary-row total">
              <span>Total final</span>
              <strong>{{ totalWithDelivery | number:'1.2-2' }} €</strong>
            </div>
          </div>
          <div class="step-actions">
            <button class="btn btn-ghost" (click)="step = 2">← Voltar</button>
            <button class="btn btn-primary" [disabled]="placing" (click)="placeOrder()">
              {{ placing ? 'A processar...' : 'Confirmar encomenda' }}
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .stepper {
      display: flex;
      align-items: center;
      gap: .5rem;
      margin: 1.5rem 0;
    }
    .step {
      display: flex;
      align-items: center;
      gap: .4rem;
      color: var(--text-3);
      font-size: .88rem;
    }
    .step.active { color: var(--text); }
    .step.done { color: var(--green); }
    .step-num {
      width: 26px; height: 26px;
      border: 2px solid var(--border);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: .8rem;
    }
    .step.active .step-num { border-color: var(--blue); color: var(--blue); }
    .step.done .step-num { border-color: var(--green); background: var(--green); color: #fff; }
    .step-line { flex: 1; height: 1px; background: var(--border); max-width: 60px; }
    .delivery-options { display: flex; flex-direction: column; gap: .75rem; margin: 1rem 0; }
    .delivery-option {
      display: flex; align-items: center; gap: 1rem;
      border: 2px solid var(--border); border-radius: var(--radius);
      padding: .8rem 1rem; cursor: pointer;
      transition: border-color .2s;
    }
    .delivery-option.selected { border-color: var(--blue); background: var(--blue-glow); }
    .delivery-option input { margin: 0; width: auto; }
    .delivery-info { display: flex; flex-direction: column; gap: .1rem; }
    .delivery-info span { color: var(--text-2); font-size: .85rem; }
    .total-row { margin: 1rem 0; font-size: 1.1rem; }
    .step-actions { display: flex; gap: .75rem; margin-top: 1rem; }
    .summary-info { margin: 1rem 0; }
    .summary-row { display: flex; justify-content: space-between; padding: .5rem 0; border-bottom: 1px solid var(--border); }
    .summary-row.total { border-bottom: none; font-size: 1.15rem; margin-top: .25rem; }
    .mt { margin-top: 1rem; }
  `]
})
export class CheckoutComponent implements OnInit, OnDestroy {
  readonly cartService = inject(CartService);
  private readonly orderService = inject(OrderService);
  private readonly smService = inject(SupermarketService);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  step = 1;
  selectedMethod: 'pickup' | 'courier' | '' = '';
  deliveryMethods: DeliveryMethod[] = [];
  loadingDelivery = false;
  placing = false;
  error = '';
  private cartTotal = 0;
  deliveryCost = 0;

  get totalWithDelivery(): number {
    return this.cartTotal + this.deliveryCost;
  }

  ngOnInit(): void {
    this.cartService.getCart().pipe(takeUntil(this.destroy$)).subscribe();
    this.cartService.total$.pipe(takeUntil(this.destroy$)).subscribe(t => (this.cartTotal = t));
  }

  loadDelivery(): void {
    const items = this.cartService['_items$'].getValue();
    if (!items.length) return;
    const smId = items[0]?.productId?._id;
    if (!smId) return;
    // Use the supermarket from cart items to get delivery methods
    // We'll use the supermarket ID from the product's supermarketId
    this.loadingDelivery = true;
  }

  onMethodChange(): void {
    const found = this.deliveryMethods.find(m => m.type === this.selectedMethod);
    this.deliveryCost = found?.cost ?? 0;
  }

  placeOrder(): void {
    if (!this.selectedMethod) return;
    this.placing = true;
    this.error = '';
    this.orderService.checkout(this.selectedMethod).pipe(takeUntil(this.destroy$)).subscribe({
      next: order => {
        this.cartService.clearCart().subscribe();
        this.router.navigate(['/orders', order._id]);
      },
      error: err => {
        this.placing = false;
        const msg = err?.error?.message ?? '';
        this.error = msg.includes('stock') ? 'Stock insuficiente. Volte ao carrinho e ajuste as quantidades.' : 'Erro ao processar encomenda. Tente novamente.';
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
