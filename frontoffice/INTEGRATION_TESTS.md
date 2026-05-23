# Testes de Integração — Frontoffice Angular

**Data:** 2026-05-18
**Stack:** Angular 21 (porta 4200) + API Express (porta 3000)
**Executar com:** `ng serve` no frontoffice + `npm run dev` na raiz

---

## Pré-requisitos

- [X] Servidor Express em execução em `http://localhost:3000`
- [X] Frontoffice Angular em execução em `http://localhost:4200`
- [X] Base de dados com pelo menos um supermercado aprovado e produtos com stock
- [X] Credenciais: `admin@marketplace.pt` / `admin123`

---

## Fluxo 1 — Registo e Autenticação

**Caminho:** `/auth/register` e `/auth/login`

| # | Passo | Resultado Esperado | Estado |
|---|-------|--------------------|--------|
| 1 | Abrir `/auth/register` | Formulário de registo visível | X |
| 2 | Clicar Submeter com todos os campos vazios | Todos os campos mostram erro de validação (vermelho) | X |
| 3 | Preencher email com formato inválido (ex: `teste`) | Erro "email inválido" no campo email | X |
| 4 | Introduzir password com menos de 6 chars | Indicador "muito fraca" + mensagem de erro | X |
| 5 | Preencher password e confirm com valores diferentes | Erro "as passwords não coincidem" | X |
| 6 | Preencher todos os campos correctamente e submeter | Registo bem-sucedido, sem erros visíveis | X |
| 7 | Após registo | Redireccionamento automático para `/` (home) | ⬜ |
| 8 | Abrir DevTools → Application → Local Storage → `localhost:4200` | Chave `mp_token` presente (JWT), chave `mp_user` presente | ⬜ |
| 9 | Verificar que `mp_user` NÃO contém campo `password` | Só contém `_id`, `name`, `email`, `role` | ⬜ |
| 10 | Fechar o browser, reabrir `http://localhost:4200` | Utilizador continua autenticado (token persiste) | ⬜ |
| 11 | Clicar em "Sair" / "Logout" na navbar | Token removido do localStorage, redireccionado para `/` ou `/auth/login` | ⬜ |
| 12 | Verificar localStorage após logout | `mp_token` e `mp_user` removidos | ⬜ |

(erro a partir da submissão de um perfil; não está a criar nem a guardar essa pessoa)

---

## Fluxo 2 — Protecção de Rotas (Auth Guard)

**Componente:** `auth.guard.ts`

| # | Passo | Resultado Esperado | Estado |
|---|-------|--------------------|--------|
| 1 | Sem login, navegar directamente para `/cart` | Redireccionado para `/auth/login?returnUrl=%2Fcart` | X |
| 2 | Fazer login na página de login | Após login, redireccionado de volta para `/cart` | X |
| 3 | Sem login, tentar `/checkout` | Redireccionado para login com returnUrl=/checkout | X |
| 4 | Sem login, tentar `/orders` | Redireccionado para login | X |
| 5 | Sem login, tentar `/profile` | Redireccionado para login | X |
| 6 | Sem login, abrir `/shop` | Acessível (público) — lista de produtos visível | X |
| 7 | Sem login, abrir `/product/:id` (ID válido) | Acessível (público) — detalhe do produto visível | ⬜ |
| 8 | Sem login, abrir `/` (home) | Acessível — página inicial visível | ⬜ |

(está a ter problemas a carregar algumas coisas; provavelmente tem problemas de conectividade com a base de dados)
---

## Fluxo 3 — Carrinho e Regra de Supermercado Único (Regra 8a)

**Caminho:** `/shop` → `/cart`

| # | Passo | Resultado Esperado | Estado |
|---|-------|--------------------|--------|
| 1 | Fazer login como cliente | Autenticado com sucesso | X |
| 2 | Navegar para `/shop`, adicionar produto do Supermercado A | Produto adicionado, badge do carrinho actualizado | ⬜ |
| 3 | Tentar adicionar produto de um Supermercado B diferente | Mensagem de erro clara: "só podes encomendar de um supermercado por encomenda" | ⬜ |
| 4 | Verificar que o carrinho só tem produtos do Supermercado A | `/cart` mostra apenas produtos do SM A | ⬜ |
| 5 | Clicar "Limpar Carrinho" em `/cart` | Carrinho fica vazio, badge = 0 | ⬜ |
| 6 | Adicionar produto do Supermercado B ao carrinho vazio | Produto adicionado sem erro | ⬜ |
| 7 | Verificar que o carrinho agora tem produto do SM B | SM B é o supermercado activo do carrinho | ⬜ |
| 8 | Adicionar produto com stock=0 | Botão "Adicionar" desactivado ou mensagem "sem stock" | ⬜ |

(não dá para adicionar produtos)
---

## Fluxo 4 — Checkout Completo

**Caminho:** `/cart` → `/checkout` → `/orders/:id`

| # | Passo | Resultado Esperado | Estado |
|---|-------|--------------------|--------|
| 1 | Ter pelo menos 1 produto no carrinho | Carrinho não vazio | ⬜ |
| 2 | Navegar para `/checkout` | Página de checkout visível (não redireccionado) | X |
| 3 | Passo 1 (Resumo): verificar itens | Nomes, quantidades e preços correctos vs carrinho | ⬜ |
| 4 | Passo 2 (Entrega): verificar métodos disponíveis | Só métodos suportados pelo supermercado (pickup e/ou courier) | ⬜ |
| 5 | Seleccionar método de entrega "pickup" | Total actualiza (custo = 0 para pickup) | ⬜ |
| 6 | Seleccionar método "courier" (se disponível) | Total actualiza com custo de entrega | ⬜ |
| 7 | Confirmar encomenda | Pedido POST /orders enviado com sucesso | ⬜ |
| 8 | Após confirmação | Redireccionado para `/orders/:id` da nova encomenda | ⬜ |
| 9 | Verificar estado da encomenda na página | Status "pending" visível | ⬜ |
| 10 | Verificar que o carrinho ficou vazio | `/cart` mostra "carrinho vazio", badge = 0 | ⬜ |
| 11 | Tentar ir a `/checkout` com carrinho vazio | Mensagem de aviso ou redireccionamento para `/cart` | ⬜ |

(aparece que o supermercado não tem métodos de entrega configurados)
---

## Fluxo 5 — Mapa e Tracking de Encomenda

**Caminho:** `/orders/:id` com encomenda em status "delivering"
**Componente:** `order-detail` + Leaflet

| # | Passo | Resultado Esperado | Estado |
|---|-------|--------------------|--------|
| 1 | Criar encomenda com `deliveryMethod=courier` | Encomenda criada em status "pending" | ⬜ |
| 2 | Como admin: avançar para "confirmed" e "preparing" | Status actualizado | ⬜ |
| 3 | Como estafeta: aceitar entrega (→ "delivering") | Status "delivering", courierId atribuído | ⬜ |
| 4 | Como cliente: abrir `/orders/:id` | Página de detalhe visível | ⬜ |
| 5 | Verificar que o mapa Leaflet aparece (não em branco) | Mapa renderizado com tiles carregados | ⬜ |
| 6 | Verificar pin do supermercado | Marcador na morada do supermercado | ⬜ |
| 7 | Verificar pin do cliente | Marcador na morada do cliente | ⬜ |
| 8 | Verificar pin do estafeta | Marcador na posição do estafeta (se implementado) | ⬜ |
| 9 | Verificar contagem regressiva de tempo | Timer visível e a decrementar | ⬜ |
| 10 | Navegar para outra página (ex: `/shop`) e voltar | Sem erros de "interval já destruído" na consola | ⬜ |
| 11 | Verificar que o `ngOnDestroy` limpou o interval | Abrir DevTools → Console → sem erros de interval após navegação | ⬜ |

---

## Fluxo 6 — Cancelamento (Regra dos 5 Minutos — Regra 8b)

**Caminho:** `/orders/:id`

| # | Passo | Resultado Esperado | Estado |
|---|-------|--------------------|--------|
| 1 | Criar encomenda e confirmar (admin avança para "confirmed") | Encomenda em status "confirmed" | ⬜ |
| 2 | Dentro de 5 minutos: verificar botão "Cancelar" na página | Botão "Cancelar" visível e activo | ⬜ |
| 3 | Clicar "Cancelar" dentro dos 5 minutos | Diálogo de confirmação aparece | ⬜ |
| 4 | Confirmar cancelamento | Encomenda muda para "cancelled", botão desaparece | ⬜ |
| 5 | Criar nova encomenda, confirmar com admin | Encomenda em "confirmed" | ⬜ |
| 6 | Aguardar 5+ minutos sem cancelar | — | ⬜ |
| 7 | Após 5 minutos: verificar botão "Cancelar" | Botão desaparece OU aparece desactivado | ⬜ |
| 8 | Se botão ainda visível: tentar clicar | Mensagem de erro: "prazo de cancelamento expirou" | ⬜ |

---

## Fluxo 7 — Estados de Loading e Tratamento de Erros

**Componentes:** interceptor, serviços, componentes de erro

| # | Passo | Resultado Esperado | Estado |
|---|-------|--------------------|--------|
| 1 | Com rede activa: navegar entre páginas | Spinner de loading aparece e desaparece suavemente | ⬜ |
| 2 | Parar o servidor Express (Ctrl+C) | — | ⬜ |
| 3 | Tentar fazer login com servidor parado | Mensagem de erro visível: "servidor indisponível" ou similar | ⬜ |
| 4 | Confirmar que a aplicação não crasha (sem tela branca) | App continua funcionando, apenas com mensagem de erro | ⬜ |
| 5 | Reiniciar o servidor Express | — | ⬜ |
| 6 | Fazer login normalmente sem refresh da página | Login bem-sucedido (app recupera automaticamente) | ⬜ |
| 7 | Navegar para `/product/idquenaoexiste` | Mensagem inline "produto não encontrado" (não crash, não página branca) | ⬜ |
| 8 | Navegar para `/orders/idquenaoexiste` | Mensagem inline de erro 404 | ⬜ |
| 9 | Simular token expirado: editar o token no localStorage para um inválido | Próximo pedido autenticado → logout automático → redireccionado para login | ⬜ |
| 10 | Verificar erros 403 | Se aceder a recurso sem permissão, mensagem clara (não crash) | ⬜ |

---

## Fluxo 8 — Responsividade e Mobile

**Ferramentas:** DevTools → Toggle Device Toolbar (F12 → ícone de dispositivo)

| # | Dispositivo | Passo | Resultado Esperado | Estado |
|---|-------------|-------|--------------------|--------|
| 1 | iPhone SE (375px) | Abrir a aplicação | Layout responsivo, sem overflow horizontal | ⬜ |
| 2 | iPhone SE | Verificar navbar | Ícone hamburger visível, menu funcional | ⬜ |
| 3 | iPhone SE | Navegar para `/shop` | Grelha de produtos em 1 coluna | ⬜ |
| 4 | iPhone SE | Abrir `/auth/register` | Formulário usável (campos não cortados, teclado não bloqueia) | ⬜ |
| 5 | iPhone SE | Abrir `/orders/:id` com mapa | Mapa ocupando 100% da largura ou em tab separado | ⬜ |
| 6 | iPhone SE | Ir ao `/cart` | Itens visíveis, botão "Checkout" acessível | ⬜ |
| 7 | Tablet (768px) | Navegar para `/shop` | Grelha de produtos em 2 colunas | ⬜ |
| 8 | Tablet | Verificar navbar | Navbar completa (sem hamburger) ou semi-expandida | ⬜ |
| 9 | Desktop (1280px) | Verificar layout geral | Grelha em 3-4 colunas, sidebar ou navbar horizontal | ⬜ |
| 10 | Desktop | Verificar hover states | Botões com hover effect, cards com transição | ⬜ |

---

## Fluxo 9 — Perfil e Dados do Utilizador

**Caminho:** `/profile`

| # | Passo | Resultado Esperado | Estado |
|---|-------|--------------------|--------|
| 1 | Fazer login e navegar para `/profile` | Dados actuais do utilizador visíveis (nome, email, morada) | ⬜ |
| 2 | Verificar que o campo password está oculto | Password NÃO visível na página de perfil | ⬜ |
| 3 | Abrir DevTools → Network → GET /auth/me | Resposta sem campo `password` | ⬜ |
| 4 | Se existir edição de perfil: submeter formulário vazio | Erros de validação nos campos obrigatórios | ⬜ |

---

## Fluxo 10 — Comparação de Preços

**Caminho:** `/shop` → botão "Comparar" ou `/product/:id`

| # | Passo | Resultado Esperado | Estado |
|---|-------|--------------------|--------|
| 1 | Pesquisar um produto que existe em múltiplos supermercados | Lista de produtos com mesmo nome, preços diferentes | ⬜ |
| 2 | Verificar que o menor preço está destacado | Indicador visual do melhor preço | ⬜ |
| 3 | Pesquisar produto que só existe num supermercado | Apenas 1 resultado na comparação | ⬜ |
| 4 | Pesquisar nome de produto inexistente | Mensagem "nenhum resultado encontrado" | ⬜ |

---

## Checklist de Consola (DevTools → Console)

Após executar todos os fluxos, verificar que a consola do browser **não contém**:

| Verificação | Estado |
|-------------|--------|
| Erros JavaScript não tratados (Uncaught Error) | ⬜ |
| Erros de CORS | ⬜ |
| Chamadas a URLs hardcoded (ex: `localhost:3000` em vez de `environment.apiUrl`) | ⬜ |
| Warnings de ExpressionChangedAfterItHasBeenChecked | ⬜ |
| Memory leaks de subscriptions (Observables não cancelados) | ⬜ |
| Tokens ou passwords em `console.log` | ⬜ |

---

## Notas de Implementação

- O `AuthInterceptor` em [auth.interceptor.ts](src/app/core/interceptors/auth.interceptor.ts) deve tratar `status === 0` (sem rede), `401` (logout) e `403` (sem permissão)
- O `AuthGuard` em [auth.guard.ts](src/app/core/guards/auth.guard.ts) deve verificar `isLoggedIn()` que inclui validação de expiração do JWT
- O localStorage só deve conter `mp_token` e `mp_user` — nunca passwords ou dados sensíveis adicionais
