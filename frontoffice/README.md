# Frontoffice Angular — Marketplace de Supermercados Locais

Angular 21 frontoffice para clientes finais, que consome a REST API do backend Express (porta 3000).

## Tecnologias

- Angular 21 (standalone components, functional guards/interceptors, lazy loading)
- Leaflet + OSRM para mapas e cálculo de rotas
- Nominatim (OpenStreetMap) para geocoding gratuito
- JWT auth via localStorage + sessão Express para carrinho

## Arranque rápido

```bash
# Backend (porta 3000) — a partir da raiz do projecto
npm start

# Frontend (porta 4200)
cd frontoffice
npm install
ng serve
```

Abrir: `http://localhost:4200`

## Estrutura

```
src/app/
├── core/
│   ├── models/          ← interfaces TypeScript (User, Product, Order, Supermarket, Category)
│   ├── services/        ← auth, product, supermarket, cart, order, map, category
│   ├── guards/          ← authGuard (functional)
│   └── interceptors/    ← authInterceptor (functional, injeta JWT + withCredentials)
├── shared/
│   ├── components/      ← navbar, footer, loading-spinner, product-card
│   └── pipes/           ← priceUnit ("2,50 €/kg")
└── features/
    ├── home/            ← lista supermercados + mapa Leaflet com geocoding
    ├── shop/            ← loja com filtros, debounce e paginação
    ├── product-detail/  ← detalhe + tabela de comparação de preços
    ├── cart/            ← carrinho reactivo sincronizado com servidor
    ├── checkout/        ← stepper 3 passos (resumo → entrega → confirmar)
    ├── orders/          ← histórico ordenado com badges de estado
    ├── order-detail/    ← detalhe + mapa OSRM + contagem regressiva
    ├── auth/            ← login (returnUrl) + registo (validação completa)
    └── profile/         ← editar dados + alterar password
```

## Design System

Dark theme consistente com o backoffice. Variáveis CSS em `styles.css`.
Fontes: **Syne** (títulos) + **DM Sans** (texto) via Google Fonts.

## Segurança

- JWT em localStorage; nunca exposto em logs
- Interceptor injeta `Authorization: Bearer <token>` em todos os pedidos
- Guard decodifica o payload (sem biblioteca) e verifica expiração
- Erros 401 redirecionam para login e limpam o token
- Angular template escaping por defeito
- Validação reactiva em todos os formulários

## Guião de testes

→ [TESTING.md](./TESTING.md)
