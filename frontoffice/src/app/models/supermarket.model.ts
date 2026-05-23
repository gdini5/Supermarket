export type DeliveryMethodType = 'pickup' | 'courier';

export interface DeliveryMethod {
  type: DeliveryMethodType;
  cost: number;
}

/** Coordenadas geográficas (opcionais) para apresentação em mapa. */
export interface GeoLocation {
  lat: number | null;
  lng: number | null;
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
  location?: GeoLocation;
  deliveryMethods?: DeliveryMethod[];
  approved: boolean;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}
