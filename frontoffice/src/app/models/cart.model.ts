/* Um item dentro do carrinho, espelha o que obackend guarda na sessão. */
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  priceUnit: string;
  image: string;
  quantity: number;
}

/** Resposta de GET /cart. */
export interface Cart {
  items: CartItem[];
  supermarketId: string | null;
}
