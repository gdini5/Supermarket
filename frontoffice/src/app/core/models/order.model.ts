export type OrderStatus =
  'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  clientId: string;
  supermarketId: { _id: string; name: string; address?: string };
  courierId?: { _id: string; name: string; vehicle?: string };
  items: OrderItem[];
  total: number;
  deliveryMethod: 'pickup' | 'courier';
  deliveryCost: number;
  status: OrderStatus;
  confirmedAt: string;
  createdAt: string;
}
