import { Supermarket } from './supermarket.model';

export type PriceUnit = 'un.' | 'kg' | 'lt' | 'cx';

/**
 * Produto disponível no marketplace.
 * Corresponde ao schema `Product` do backend.
 *
 * Nota: nas respostas da API, `supermarketId` vem populado (objeto Supermarket parcial)
 * quando o endpoint usa .populate(). Por isso aceitamos os dois tipos.
 */
export interface Product {
  _id: string;
  supermarketId: string | Pick<Supermarket, '_id' | 'name' | 'address' | 'deliveryMethods'>;
  name: string;
  description?: string;
  category: string;
  price: number;
  priceUnit: PriceUnit;
  stock: number;
  image: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Resposta paginada do endpoint GET /products
 */
export interface PaginatedProducts {
  products: Product[];
  total: number;
  page: number;
  pages: number;
}

/**
 * Parâmetros de filtragem/ordenação para a listagem de produtos.
 * Todos opcionais — alinhados com os query params suportados pelo backend.
 */
export interface ProductQuery {
  search?: string;
  category?: string;
  supermarketId?: string;
  sort?: 'price_asc' | 'price_desc';
  page?: number;
  limit?: number;
}
