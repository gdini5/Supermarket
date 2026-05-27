export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'client' | 'supermarket' | 'courier' | 'admin';
  address: string;
  phone: string;
  vehicle?: 'bicycle' | 'motorcycle' | 'car' | 'foot';
  active: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}
