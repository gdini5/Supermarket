import { Routes } from '@angular/router';

import { authGuard } from './guards/auth.guard';

/**
 * Rotas do frontoffice.
 *
 * As rotas comentadas no fundo (cart, checkout, orders) ficam reservadas para
 * o colega — deve adicioná-las à medida que os componentes forem criados.
 */
export const routes: Routes = [
  // Página inicial: lista de supermercados (pública)
  {
    path: '',
    loadComponent: () => import('./components/home/home').then(m => m.Home),
    title: 'Início | Marketplace',
  },

  // Catálogo: pesquisa de produtos com filtros (pública)
  {
    path: 'shop',
    loadComponent: () => import('./components/shop/shop').then(m => m.Shop),
    title: 'Loja | Marketplace',
  },

  // Detalhe de produto (pública, mas o botão "Adicionar ao carrinho" só
  // funciona para clientes autenticados — verificado dentro do componente).
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./components/product-detail/product-detail').then(m => m.ProductDetail),
    title: 'Produto | Marketplace',
  },

  // Auth
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then(m => m.Login),
    title: 'Iniciar sessão | Marketplace',
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register').then(m => m.Register),
    title: 'Registar | Marketplace',
  },
{
  path: 'cart',
  loadComponent: () => import('./components/cart/cart').then(m => m.Cart),
  canActivate: [authGuard],
  title: 'Carrinho | Marketplace',
},
{
  path: 'checkout',
  loadComponent: () => import('./components/checkout/checkout').then(m => m.Checkout),
  canActivate: [authGuard],
  title: 'Finalizar encomenda | Marketplace',
},
{
  path: 'orders',
  loadComponent: () => import('./components/orders/orders').then(m => m.Orders),
  canActivate: [authGuard],
  title: 'As minhas encomendas | Marketplace',
},
{
  path: 'orders/:id',
  loadComponent: () => import('./components/order-detail/order-detail').then(m => m.OrderDetail),
  canActivate: [authGuard],
  title: 'Detalhe da encomenda | Marketplace',
},

{
  path: 'profile',
  loadComponent: () => import('./components/profile/profile').then(m => m.Profile),
  canActivate: [authGuard],
  title: 'O meu perfil | Marketplace',
},

  // Wildcard — redireciona para a home
  { path: '**', redirectTo: '' },
];
