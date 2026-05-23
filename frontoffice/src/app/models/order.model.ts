export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderClientRef {
  _id: string;
  name: string;
  email: string;
}

export interface OrderSupermarketRef {
  _id: string;
  name: string;
  address?: string;
}

export interface OrderCourierRef {
  _id: string;
  name: string;
  phone?: string;
}

export interface Order {
  _id: string;
  clientId: OrderClientRef | null;
  supermarketId: OrderSupermarketRef | null;
  courierId?: OrderCourierRef | null;
  items: OrderItem[];
  total: number;
  deliveryMethod: 'pickup' | 'courier';
  deliveryCost: number;
  status: OrderStatus;
  confirmedAt: string;
  createdAt: string;
  updatedAt: string;
}
