/**
 * Representa um utilizador da plataforma.
 * Corresponde ao schema `User` do backend (sem o campo password).
 */
export type UserRole = 'client' | 'supermarket' | 'courier' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  role: UserRole;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Versão minimalista do User devolvida pelos endpoints de login/registo
 * (apenas o necessário para identificar a sessão).
 */
export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
}
