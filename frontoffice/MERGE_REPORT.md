# Relatório de Merge

## Decisões de conflito

| Ficheiro | Colega A | Colega B | Decisão | Razão |
|----------|----------|----------|---------|-------|
| `navbar.ts` | Sem badge | Com badge (via CartService) | Colega B + A | Badge adicionado à navbar do A com CartService do B |
| `product-detail.ts` | Placeholder `addToCart()` com `alert()` | CartService real | Colega B | Funcional; integração real com carrinho |
| `app.config.ts` | ✅ Completo | ❌ | Colega A | Arquitectura moderna: zoneless, interceptors, appInitializer |
| `auth.service.ts` | ✅ Completo | ❌ | Colega A | `loadCurrentUser`, `clearSession`, verificação de role |
| `app.routes.ts` | Parcial (rotas B comentadas) | Completo | Merge | Todas as rotas necessárias incluídas |
| `cart.ts` | ❌ | ✅ Novo | Colega B | Componente novo adicionado |
| `checkout.ts` | ❌ | ✅ Novo | Colega B | Componente novo adicionado |
| `orders.ts` | ❌ | ✅ Novo | Colega B | Componente novo adicionado |
| `order-detail.ts` | ❌ | ✅ Novo | Colega B | Componente novo adicionado |

## Bugs corrigidos durante o merge

| Ficheiro | Bug | Correção |
|----------|-----|---------|
| `checkout.html` | `[(ngModel)]="selectedMethod"` — `signal()` não é compatível com two-way binding | Alterado para `[ngModel]="selectedMethod()" (ngModelChange)="selectedMethod.set($event)"` |
| `order-detail.ts` | `canCancel` verificava só `pending`, devia também verificar `confirmed` | Substituído por `canCancelOrder()` do utilitário partilhado |

## Código extraído para reutilização

- `shared/order-status.utils.ts` — `getStatusLabel()`, `canCancelOrder()`
  - Centraliza labels de estado e lógica de janela de cancelamento (5 min)
  - Usado em `components/orders/orders.ts` e `components/order-detail/order-detail.ts`

## Localização final dos componentes

```
src/app/components/
├── home/              ← Colega A
├── shop/              ← Colega A
├── login/             ← Colega A
├── register/          ← Colega A
├── product-detail/    ← Colega A (addToCart integrado com CartService do B)
├── cart/              ← Colega B (movido de src/app/cart/)
├── checkout/          ← Colega B (movido de src/app/checkout/)
├── orders/            ← Colega B (movido de src/app/orders/)
├── order-detail/      ← Colega B (movido de src/app/orders-detail/)
└── layout/navbar/     ← Colega A + badge do B
```

## Dependências adicionadas / instaladas

| Pacote | Motivo |
|--------|--------|
| `@angular/material` | Componentes de ambos os colegas (estava em package.json mas não instalado) |
| `@angular/animations` | Necessário para `provideAnimationsAsync()` no app.config.ts |

## Alterações ao tsconfig.app.json

Excluídas da compilação as pastas órfãs que causavam erros mas não fazem parte da app:
- `src/app/features/**` — estrutura alternativa não utilizada pelo router
- `src/app/core/**` — serviços/modelos duplicados da estrutura features/
- `src/app/shared/components/**` — componentes não referenciados pela app
- `src/app/shared/pipes/**` — pipes não referenciadas pela app
- `src/app/cart/**`, `src/app/checkout/**`, `src/app/orders/**`, `src/app/orders-detail/**` — localizações originais incorrectas (supersedidas por `components/`)

## Estado após merge

- [x] `ng build` sem erros
- [x] Lazy chunks gerados: cart, checkout, orders, order-detail, product-detail, shop, home, login, register
- [ ] Fluxo login/logout funcional — verificar com servidor em execução
- [ ] Carrinho sincronizado com servidor
- [ ] Checkout mostra deliveryMethods reais
- [ ] OrderDetail polling cancela em ngOnDestroy
- [ ] Badge da navbar actualiza ao adicionar produto ao carrinho
