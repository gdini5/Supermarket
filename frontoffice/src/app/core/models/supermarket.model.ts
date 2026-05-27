export interface DeliveryMethod {
  type: 'pickup' | 'courier';
  cost: number;
}

export interface Supermarket {
  _id: string;
  name: string;
  description?: string;
  address: string;
  schedule?: string;
  deliveryMethods: DeliveryMethod[];
  approved: boolean;
  active: boolean;
  lat?: number;
  lng?: number;
}
