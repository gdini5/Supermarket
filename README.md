# Marketplace de Supermercados Locais

Plataforma web de marketplace que liga supermercados locais a clientes finais.
Os supermercados publicam e gerem os seus produtos, os clientes pesquisam,
comparam preços e encomendam, e as entregas são feitas por estafetas ou
levantadas em loja.

Projeto desenvolvido no âmbito da unidade curricular de **Programação em
Ambiente Web (PAW)** — ESTG / P.PORTO.

---

## Índice

- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e configuração](#instalação-e-configuração)
- [Como executar](#como-executar)
- [Tipos de utilizador](#tipos-de-utilizador)
- [Documentação da API (Swagger)](#documentação-da-api-swagger)
- [Funcionalidades](#funcionalidades)
- [Notas de segurança](#notas-de-segurança)

---

## Arquitetura

O projeto está dividido em duas aplicações que partilham a mesma base de dados:

| Aplicação | Tecnologia | Utilizadores | Porta |
|-----------|-----------|--------------|-------|
| **Backoffice** | ExpressJS + EJS (server-side rendering) | Admin, Supermercado, Estafeta | 3000 |
| **Frontoffice** | Angular (SPA) + API REST | Cliente final | 4200 |

O backoffice (Milestone 1) é renderizado no servidor com EJS. O frontoffice
(Milestone 2) é uma Single Page Application em Angular que comunica com o
backend através de uma **API REST** (`/api/v1`), com autenticação **JWT**.

```
┌──────────────────┐        REST + JWT        ┌──────────────────┐
│   Frontoffice    │ ───────────────────────> │                  │
│  (Angular :4200) │ <─────────────────────── │   Backend        │
└──────────────────┘                          │   ExpressJS      │
                                              │   (:3000)        │
┌──────────────────┐    server-side (EJS)     │                  │
│   Backoffice     │ <──────────────────────> │   + MongoDB      │
│  (admin/super/   │                          │                  │
│   estafeta)      │                          └──────────────────┘
└──────────────────┘
```

---

## Tecnologias

**Backend**
- Node.js + ExpressJS 4
- MongoDB + Mongoose 8
- EJS (template engine do backoffice)
- JWT (autenticação da API REST)
- bcryptjs (hashing de passwords)
- helmet, cors, express-mongo-sanitize (segurança)
- Swagger (documentação da API)

**Frontoffice**
- Angular 21 (standalone components, signals, zoneless)
- Angular Material (componentes de UI)
- Leaflet + OpenStreetMap (mapa de supermercados — bonificação)

---

## Estrutura do projeto

```
Supermarket/
├── app.js                  # ponto de entrada do ExpressJS
├── seed.js                 # cria o admin e as categorias padrão
├── config/                 # constantes e configuração (Swagger, etc.)
├── controllers/            # controladores do backoffice (MVC)
├── middleware/             # apiAuth (JWT), validação, error handler
├── models/                 # schemas Mongoose (User, Supermarket, Product, Order, Category)
├── routes/
│   ├── api/                # rotas REST (/api/v1) consumidas pelo Angular
│   └── ...                 # rotas EJS do backoffice
├── views/                  # templates EJS do backoffice
├── public/                 # estáticos (CSS, imagens dos produtos)
└── frontoffice/            # aplicação Angular (Milestone 2)
    └── src/app/
        ├── components/     # home, shop, product-detail, cart, checkout,
        │                   # orders, order-detail, profile, login, register
        ├── services/       # auth, product, supermarket, cart, order, category
        ├── guards/         # authGuard
        ├── interceptors/   # auth (Bearer) + erros
        └── models/         # interfaces TypeScript
```

---

## Pré-requisitos

- **Node.js** 18 ou superior
- **MongoDB** (local ou Atlas)
- **Angular CLI** (`npm install -g @angular/cli`)

---

## Instalação e configuração

### 1. Backend

Na pasta `Supermarket/`:

```bash
npm install
```

Cria um ficheiro `.env` a partir do `.env.example`:

```bash
cp .env.example .env
```

Preenche o `.env` com os teus valores:

```
MONGO_URI=mongodb://localhost:27017/marketplace
SESSION_SECRET=<string-aleatoria-longa>
PORT=3000
JWT_SECRET=<outra-string-aleatoria-longa>
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:4200
```

### 2. Frontoffice

Na pasta `Supermarket/frontoffice/`:

```bash
npm install
```

> Nota: o projeto inclui um `.npmrc` com `legacy-peer-deps=true` para resolver
> um conflito de peer dependencies entre versões de patch do Angular. O
> `npm install` funciona sem flags adicionais.

### 3. Popular a base de dados

Na pasta `Supermarket/`, cria o utilizador administrador e as categorias:

```bash
npm run seed
```

Isto cria o admin: **admin@marketplace.pt** / **admin123**

---

## Como executar

São precisos dois terminais.

**Terminal 1 — Backend (porta 3000):**
```bash
cd Supermarket
npm run dev
```

**Terminal 2 — Frontoffice (porta 4200):**
```bash
cd Supermarket/frontoffice
ng serve
```

Aceder a:
- **Frontoffice (clientes):** http://localhost:4200
- **Backoffice (admin/super/estafeta):** http://localhost:3000
- **Documentação da API:** http://localhost:3000/api/docs

### Primeiro arranque — criar dados de teste

O seed só cria o admin e as categorias. Para a loja ter conteúdo:

1. No backoffice, regista um **supermercado** (ou cria pelo painel admin)
2. Entra como **admin** e **aprova** o supermercado
3. Entra como **supermercado** e adiciona **produtos**, define os **métodos de
   entrega** (menu "Entregas") e a **localização** no mapa (menu "Localização")
4. No frontoffice, regista uma conta de **cliente** e começa a comprar

---

## Tipos de utilizador

| Tipo | Onde | Pode |
|------|------|------|
| **Cliente** | Frontoffice (Angular) | Pesquisar, comparar preços, encomendar, escolher entrega, ver histórico e perfil |
| **Supermercado** | Backoffice | Gerir produtos, preços, stock, métodos de entrega, localização, encomendas |
| **Estafeta** | Backoffice | Aceitar entregas disponíveis, atualizar estado, ver histórico |
| **Administrador** | Backoffice | Aprovar supermercados, gerir utilizadores e categorias, monitorizar |

---

## Documentação da API (Swagger)

Todos os endpoints REST estão documentados com Swagger, acessível em:

```
http://localhost:3000/api/docs
```

A API segue o prefixo `/api/v1` e usa autenticação **Bearer (JWT)**. Os
principais grupos de endpoints: `auth`, `products`, `supermarkets`,
`categories`, `cart`, `orders`.

---

## Funcionalidades

**Cliente (frontoffice):**
- Registo e autenticação (JWT)
- Pesquisa de produtos por nome, filtro por categoria, ordenação por preço
- Comparação de preços do mesmo produto entre supermercados
- Carrinho (adicionar, alterar quantidade, remover) com validação de stock
- Checkout com escolha de método de entrega e cálculo de custos
- Histórico de encomendas e detalhe com acompanhamento de estado (atualização
  via web services)
- Perfil editável com estatísticas (nº de encomendas, total gasto, produto
  mais comprado)
- Cancelamento de encomenda até 5 minutos após a confirmação

**Regras de negócio implementadas:**
- Uma encomenda só pode conter produtos de um supermercado
- Cancelamento permitido até 5 minutos após confirmação
- Um estafeta só realiza uma entrega de cada vez
- Produtos sem stock não podem ser adicionados ao carrinho
- O stock é reposto quando uma encomenda é cancelada

**Bonificação:**
- Geolocalização dos supermercados com mapa interativo (Leaflet + OpenStreetMap)

---

## Notas de segurança

- Passwords guardadas com **bcrypt** (hashing, nunca em texto simples)
- Autenticação da API por **JWT** (algoritmo HS256), com expiração configurável
- **helmet** para cabeçalhos de segurança HTTP
- **CORS** restrito às origens conhecidas (frontoffice)
- **express-mongo-sanitize** para prevenir injeção NoSQL
- Cookies de sessão com `httpOnly` e `secure` (em produção)
- Variáveis sensíveis isoladas no `.env` (não versionado)
