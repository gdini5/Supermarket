/* Estados possíveis de uma encomenda. */
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';

/* Snapshot do produto no momento da compra. */
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

/* Encomenda realizada pelo cliente. */
export interface Order {
  _id: string;
  clientId: any;        // populado com { name, email }
  supermarketId: any;   // populado com { name, address, ... }
  courierId?: any;      // populado com { name, phone } quando em entrega
  items: OrderItem[];
  total: number;
  deliveryMethod: 'pickup' | 'courier';
  deliveryCost: number;
  status: OrderStatus;
  confirmedAt: string;
  createdAt: string;
  updatedAt: string;
}
