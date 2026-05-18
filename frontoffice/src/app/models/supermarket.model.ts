export type DeliveryMethodType = 'pickup' | 'courier';

export interface DeliveryMethod {
  type: DeliveryMethodType;
  cost: number;
}

/**
 * Supermercado aprovado e ativo na plataforma.
 * Corresponde ao schema `Supermarket` do backend.
 */
export interface Supermarket {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  address: string;
  schedule?: string;
  deliveryMethods?: DeliveryMethod[];
  approved: boolean;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}
