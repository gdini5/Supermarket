export type PriceUnit = 'un.' | 'kg' | 'lt' | 'cx';

export interface Product {
  _id: string;
  supermarketId: { _id: string; name: string; address: string };
  name: string;
  description?: string;
  category: string;
  price: number;
  priceUnit: PriceUnit;
  stock: number;
  image: string;
  active: boolean;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  pages: number;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  supermarketId?: string;
  sort?: string;
  page?: number;
  limit?: number;
}
