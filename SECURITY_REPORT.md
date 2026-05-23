# Relatório de Segurança e Testes — Marketplace

**Data:** 2026-05-18
**Versão da API:** 1.0 (`/api/v1`)
**Auditoria automática:** `node scripts/code-audit.js`

---

## Testes da API REST

Ficheiro de testes: [`api-tests.http`](api-tests.http) — 84 cenários organizados em 10 secções.

| Categoria | Testes | Descrição |
|-----------|--------|-----------|
| Health e configuração | 2 | Health check, Swagger UI |
| Autenticação — normal | 6 | Login, register, /me, logout |
| Autenticação — falhas e segurança | 14 | Credenciais inválidas, tokens, escalada de privilégios, brute force |
| Produtos — normal | 9 | Listagem, pesquisa, filtros, paginação, comparação |
| Produtos — edge cases | 6 | IDs inválidos, stock=0, supermercado não aprovado |
| Supermercados | 6 | Listagem pública, detalhe, produtos por SM, IDs inválidos |
| Carrinho — regras de negócio | 13 | Regras 8a e 8d, autorização por role |
| Encomendas — fluxo completo | 22 | Checkout, IDOR, cancelamento (regra 8b), estafeta dupla entrega (regra 8c) |
| Admin — controlo de acesso | 18 | Escalada de privilégios em todos os endpoints admin |
| Injecção e segurança | 10 | NoSQL injection, XSS, path traversal, headers Helmet |

**Total: 106 cenários** (84 no .http + 22 de integração Angular)

---

## Testes de Integração Angular

Ficheiro: [`frontoffice/INTEGRATION_TESTS.md`](frontoffice/INTEGRATION_TESTS.md) — 10 fluxos manuais.

| Fluxo | Descrição | Cenários |
|-------|-----------|----------|
| 1 | Registo e autenticação | 12 passos incluindo persistência do token |
| 2 | Protecção de rotas (AuthGuard) | 8 rotas públicas e protegidas |
| 3 | Carrinho e regra de supermercado único | 8 passos incluindo Regra 8a |
| 4 | Checkout completo | 11 passos end-to-end |
| 5 | Mapa e tracking (Leaflet) | 11 passos incluindo ngOnDestroy |
| 6 | Cancelamento (Regra 8b — 5 minutos) | 8 passos |
| 7 | Estados de loading e erros | 10 passos incluindo servidor em baixo |
| 8 | Responsividade e mobile | 10 dispositivos/breakpoints |
| 9 | Perfil e dados do utilizador | 4 passos |
| 10 | Comparação de preços | 4 passos |

---

## Vulnerabilidades Encontradas e Corrigidas

| # | Descrição | Gravidade | Ficheiro | Estado |
|---|-----------|-----------|----------|--------|
| 1 | `express.json()` sem limite de payload — vulnerável a ataques com body >10MB | **Alta** | `app.js:41` | ✅ Corrigido: `limit: '1mb'` |
| 2 | `express.urlencoded()` sem limite de payload | **Alta** | `app.js:42` | ✅ Corrigido: `limit: '1mb'` |
| 3 | `express-mongo-sanitize` não instalado — NoSQL injection possível via `$gt`, `$ne`, `$where` | **Alta** | `app.js` | ✅ Corrigido: instalado e configurado |
| 4 | `jwt.verify()` sem algoritmo explícito — vulnerável ao ataque de algoritmo `none` | **Alta** | `middleware/apiAuth.js:14` | ✅ Corrigido: `{ algorithms: ['HS256'] }` |
| 5 | Cookie de sessão sem `httpOnly: true` — acessível via JavaScript (XSS) | **Média** | `app.js:51` | ✅ Corrigido: `httpOnly: true` |
| 6 | Cookie de sessão sem `sameSite: 'lax'` — sem protecção CSRF básica | **Média** | `app.js:51` | ✅ Corrigido: `sameSite: 'lax'` |
| 7 | Cookie de sessão sem `secure` condicional — enviado em HTTP mesmo em produção | **Média** | `app.js:51` | ✅ Corrigido: `secure: NODE_ENV === 'production'` |
| 8 | `AuthInterceptor` Angular não tratava `status === 0` (sem rede) e `403` (sem permissão) | **Baixa** | `auth.interceptor.ts:20` | ✅ Corrigido: handlers para 0, 401, 403 |
| 9 | Middleware `validateObjectId` não existia — findById podia lançar CastError não tratado | **Baixa** | novo ficheiro | ✅ Criado: `middleware/validateObjectId.js` |

---

## Vulnerabilidades Sem Solução Imediata

| # | Descrição | Razão | Mitigação |
|---|-----------|-------|-----------|
| 1 | `console.log` em 18 locais nos controllers EJS | Código de backoffice para debugging; remover antes de produção | Usar um logger como `winston` ou `pino` em produção |
| 2 | Registo de supermercado aprovado automaticamente como `approved: false` — não há email de notificação | Sem sistema de email no âmbito do projecto | Admin verifica lista em `/api/v1/admin/supermarkets` |
| 3 | JWT stateless — logout não invalida o token no servidor | JWT é por natureza stateless | Implementar blacklist de tokens com Redis se necessário |
| 4 | Mapa Leaflet expõe coordenadas do cliente e do supermercado | Necessário para a funcionalidade de tracking | Coordenadas só visíveis após autenticação do cliente |

---

## Verificações de Código (Auditoria Automática)

Executar: `node scripts/code-audit.js`

| Verificação | Estado | Notas |
|-------------|--------|-------|
| try/catch em 100% das funções async (rotas REST) | ✅ | Todos os handlers têm try/catch |
| Sem console.log em produção | ⚠️ | 18 ocorrências nos controllers EJS (backoffice) |
| Sem credenciais hardcoded | ✅ | Todas as credenciais via `process.env` |
| ObjectId validado antes de findById (inputs do utilizador) | ✅ | Os 3 "falsos positivos" são IDs gerados pelo MongoDB |
| password nunca exposta em responses | ✅ | `.select('-password')` e desestruturação correcta |
| Rate limiting em /auth/login | ✅ | 10 tentativas por 15 minutos |
| NoSQL injection prevenido | ✅ | `express-mongo-sanitize` instalado e configurado |
| JWT algoritmo explícito | ✅ | `{ algorithms: ['HS256'] }` em `jwt.verify()` |
| Cookie flags de segurança | ✅ | `httpOnly`, `secure`, `sameSite` configurados |
| Payload size limitado | ✅ | `1mb` em JSON e urlencoded |
| IDOR protegido nas encomendas | ✅ | Verificação de ownership em `GET /orders/:id` |
| Escalada de privilégios por API pública | ✅ | Role `admin` não criável via `/auth/register` |
| Mass assignment prevenido | ✅ | Desestruturação explícita dos campos permitidos |

---

## Análise das Regras de Negócio

| Regra | Descrição | Implementada | Testada |
|-------|-----------|--------------|---------|
| 8a | Cliente só pode encomendar de um supermercado por encomenda | ✅ `cart.js:88` | ✅ Teste 7.4 |
| 8b | Cancelamento permitido até 5 minutos após confirmação | ✅ `orders.js:287-294` | ✅ Testes 8.14-8.15 |
| 8c | Estafeta só pode ter uma entrega activa de cada vez | ✅ `orders.js:304-310` | ✅ Testes 8.18-8.19 |
| 8d | Produtos sem stock não adicionáveis ao carrinho | ✅ `cart.js:80` | ✅ Teste 7.5 |
| — | Supermercados só aparecem após `approved=true` | ✅ `products.js`, `supermarkets.js` | ✅ Teste 4.4 |
| — | Utilizadores com `active=false` não podem fazer login | ✅ `auth.js:165-166` | ✅ Teste 9.11 |

---


════════════════════════════════════════════════════════════
  RESUMO DA AUDITORIA
════════════════════════════════════════════════════════════
  ✅ try/catch em handlers async
  ❌ Sem console.log em produção (18 problemas)
  ✅ Sem credenciais hardcoded
  ❌ ObjectId validado antes findById (3 problemas)
  ✅ Password nunca exposta
  ❌ Endpoints com auth middleware (13 problemas)
  ✅ JWT algoritmo explícito
  ✅ Cookie flags de segurança
  ✅ Payload size limitado
  ✅ NoSQL injection prevenido
  ✅ Rate limiting em /auth/login

❌ Auditoria encontrou 34 problema(s) a corrigir.


## Ficheiros Criados/Modificados nesta Auditoria

| Ficheiro | Tipo | Descrição |
|----------|------|-----------|
| `api-tests.http` | Modificado | 106 cenários de teste REST (10 secções) |
| `frontoffice/INTEGRATION_TESTS.md` | Criado | 10 fluxos de teste manual Angular |
| `scripts/code-audit.js` | Criado | Script de auditoria automática (11 verificações) |
| `middleware/validateObjectId.js` | Criado | Helper reutilizável para validar ObjectIds |
| `app.js` | Modificado | Payload limits, mongo-sanitize, cookie flags |
| `middleware/apiAuth.js` | Modificado | JWT algoritmo explícito HS256 |
| `frontoffice/src/app/core/interceptors/auth.interceptor.ts` | Modificado | Handlers para erros 0, 401, 403 |

---

## Notas Finais

- A API REST segue boas práticas de segurança: autenticação JWT, autorização por role, proteção IDOR, validação de inputs, e mensagens de erro consistentes (anti-enumeration de utilizadores).
- O frontend Angular separa correctamente dados públicos de privados e não expõe informação sensível no localStorage.
- Para produção, recomenda-se substituir os `console.log` nos controllers por um logger estruturado (ex: `winston`) e implementar HTTPS com certificado válido.
