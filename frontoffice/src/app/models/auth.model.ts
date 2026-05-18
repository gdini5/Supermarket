import { AuthUser } from './user.model';

/**
 * Payload enviado para POST /auth/login
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Payload enviado para POST /auth/register.
 * No frontoffice, `role` é SEMPRE 'client' (esta área é exclusiva para clientes finais).
 */
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirm: string;
  address: string;
  phone: string;
  role: 'client';
}

/**
 * Resposta dos endpoints de login e registo.
 */
export interface AuthResponse {
  token: string;
  user: AuthUser;
}
