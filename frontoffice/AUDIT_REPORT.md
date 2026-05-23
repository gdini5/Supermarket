# Relatório de Auditoria — Frontoffice Angular

**Data:** 2026-05-23  
**Build:** `ng build --configuration development` ✅ PASSA SEM ERROS  
**Branch:** `template-claude`

---

## 1. Duplicação de Código

| Área | Estado | Detalhe |
|------|--------|---------|
| `supermarketNameOf()` | ✅ Único | Apenas em `shop.ts` |
| `deliverySummary()` | ✅ Único | Apenas em `home.ts` |
| `getStatusLabel()` | ✅ Centralizado | `shared/order-status.utils.ts` — usado em `orders.ts` e `order-detail.ts` |
| `canCancelOrder()` | ✅ Centralizado | `shared/order-status.utils.ts` — usado em `order-detail.ts` |
| Lógica de cálculo de total | ✅ Único | Apenas em `checkout.ts` (`subtotal`, `deliveryCost`, `total` como signals computed) |

---

## 2. Segurança

| Verificação | Estado | Detalhe |
|-------------|--------|---------|
| `AuthGuard` aplicado a rotas privadas | ✅ OK | `/cart`, `/checkout`, `/orders`, `/orders/:id` protegidos com `canActivate: [authGuard]` |
| `authGuard` redireciona com `returnUrl` | ✅ OK | `router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } })` |
| `AuthService.login()` verifica role | ✅ OK | Rejeita tokens de roles não-`client` com mensagem clara |
| `AuthService.register()` força `role: 'client'` | ✅ OK | Campo `role` não é configurável pelo utilizador |
| `localStorage` — dados mínimos | ✅ OK | Apenas `paw_token` (JWT) e `paw_user` (`{_id, name, email, role}`) |
| `error.interceptor` — trata 401/403/5xx | ✅ OK | 401 → clearSession + redirect `/login`; 403 → snackbar; 5xx → snackbar |
| `error.interceptor` — skipa snackbar em `/auth/*` | ✅ OK | Evita double-error em login/register falhados |
| `error.interceptor` — propaga erro | ✅ OK | `throwError(() => err)` — componentes recebem erro para tratamento local |

---

## 3. Memory Leaks

| Componente | Subscrição | Cleanup | Estado |
|------------|-----------|---------|--------|
| `shop.ts` | `route.queryParams` (contínua) | `takeUntil(this.destroy$)` + `ngOnDestroy` | ✅ OK |
| `order-detail.ts` | `pollingSub` (interval) | `pollingSub?.unsubscribe()` em `ngOnDestroy` | ✅ OK |
| `home.ts` | `getSupermarkets()` (one-shot) | HTTP completa e fecha automaticamente | ✅ OK |
| `cart.ts` | `cartService.get()` (one-shot) | HTTP completa e fecha automaticamente | ✅ OK |
| `checkout.ts` | `cartService.get()` + `supermarketService.getById()` (one-shot) | HTTP completa e fecha automaticamente | ✅ OK |
| `orders.ts` | `orderService.getAll()` (one-shot) | HTTP completa e fecha automaticamente | ✅ OK |
| `product-detail.ts` | `productService.getById()` (one-shot) | HTTP completa e fecha automaticamente | ✅ OK |

---

## 4. Coordenação Angular ↔ API

| Verificação | Estado | Detalhe |
|-------------|--------|---------|
| `withCredentials: true` em todos os pedidos API | ✅ CORRIGIDO | `auth.interceptor.ts` — necessário para session cookies do carrinho |
| `CartService.clear()` URL | ✅ CORRIGIDO | Era `DELETE /api/v1/cart`; backend espera `DELETE /api/v1/cart/clear` |
| `CartService.update()` URL | ✅ OK | `PUT /api/v1/cart/update` — corresponde ao backend |
| `CartService.get()` URL | ✅ OK | `GET /api/v1/cart` — corresponde ao backend |
| `OrderService.create()` URL | ✅ OK | `POST /api/v1/orders` — corresponde ao backend |
| `OrderService.updateStatus()` body | ✅ OK | Envia `{ status }` — corresponde ao `PATCH /api/v1/orders/:id/status` |
| Express: `/compare` antes de `/:id` | ✅ OK | Ordem correta — sem colisão de rotas |
| CORS backend: `credentials: true` | ✅ OK | `app.js` tem `credentials: true` e `origin` com `localhost:4200` |
| Checkout: validação de carrinho vazio | ✅ OK | `ngOnInit` redireciona para `/cart` se `cart.items.length === 0` |
| App bootstrap: `loadCurrentUser()` seguro | ✅ OK | `provideAppInitializer` usa `.catch(() => null)` |

---

## 5. Qualidade TypeScript

| Ficheiro | Antes | Depois | Estado |
|----------|-------|--------|--------|
| `order.model.ts` — `clientId` | `any` | `OrderClientRef \| null` | ✅ CORRIGIDO |
| `order.model.ts` — `supermarketId` | `any` | `OrderSupermarketRef \| null` | ✅ CORRIGIDO |
| `order.model.ts` — `courierId` | `any` | `OrderCourierRef \| null \| undefined` | ✅ CORRIGIDO |
| `checkout.ts` — `deliveryMethods` signal | `signal<any[]>` | `signal<DeliveryMethod[]>` | ✅ CORRIGIDO |
| `product-detail.ts` — `supermarketOf()` | `{ deliveryMethods?: any[] }` | `Pick<Supermarket, '_id' \| 'name' \| 'address' \| 'deliveryMethods'>` | ✅ CORRIGIDO |

---

## 6. UX — Estados de Carregamento e Erro

| Componente | Loading | Empty | Error | Estado |
|------------|---------|-------|-------|--------|
| `home` | ✅ | N/A | ✅ | OK |
| `shop` | ✅ | ✅ | ✅ | OK |
| `product-detail` | ✅ | N/A | ✅ | OK |
| `cart` | ✅ | ✅ | ✅ ADICIONADO | OK |
| `checkout` | ✅ | N/A | ✅ ADICIONADO | OK |
| `orders` | ✅ | ✅ | ✅ ADICIONADO | OK |
| `order-detail` | ✅ | N/A | ✅ | OK |

---

## 7. Correções Aplicadas

| # | Ficheiro | Problema | Gravidade | Corrigido |
|---|---------|---------|-----------|-----------|
| 1 | `auth.interceptor.ts` | `withCredentials: true` ausente — session cookies não eram enviados | 🔴 Crítico | ✅ |
| 2 | `cart.service.ts` | `clear()` chamava `DELETE /cart` em vez de `DELETE /cart/clear` | 🔴 Crítico | ✅ |
| 3 | `checkout.ts` | `[(ngModel)]` com signal — two-way binding inválido em Angular Signals | 🟠 Alto | ✅ (Sessão 1) |
| 4 | `checkout.ts` | `deliveryMethods` signal tipado como `any[]` | 🟡 Médio | ✅ |
| 5 | `checkout.ts` / `.html` | Sem estado de erro visível ao utilizador | 🟡 Médio | ✅ |
| 6 | `order.model.ts` | `clientId`, `supermarketId`, `courierId` tipados como `any` | 🟡 Médio | ✅ |
| 7 | `product-detail.ts` | `supermarketOf()` devolvia tipo inline com `any[]` | 🟡 Médio | ✅ |
| 8 | `cart.ts` / `.html` | Sem estado de erro visível ao utilizador | 🟢 Baixo | ✅ |
| 9 | `orders.ts` / `.html` | Sem estado de erro visível ao utilizador | 🟢 Baixo | ✅ |
| 10 | `navbar.ts` | Badge usava truque null em vez de `[matBadgeHidden]` | 🟢 Baixo | ✅ |
| 11 | `tsconfig.app.json` | Diretórios órfãos causavam erros de compilação | 🟠 Alto | ✅ (Sessão 1) |
| 12 | `orders.ts` | `MatDividerModule` em falta — `mat-divider` não reconhecido | 🟠 Alto | ✅ (Sessão 1) |

---

## 8. Build Final

```
ng build --configuration development
✓ Building...
✓ Application bundle generation complete.
```

**Resultado:** ✅ 0 erros, 0 warnings críticos

---

## 9. Pendentes / Recomendações Futuras

| Item | Prioridade | Notas |
|------|-----------|-------|
| Testes unitários (`*.spec.ts`) | Médio | Nenhum teste escrito — considerar para avaliação |
| `environment.ts` URL de produção | Médio | `environment.prod.ts` deve apontar para URL real do backend |
| Timeout no polling de `order-detail` | Baixo | Considerar parar polling após N tentativas ou status final |
| Validação do formulário de endereço em checkout | Baixo | Checkout não pede morada — depende do método de entrega escolhido |
