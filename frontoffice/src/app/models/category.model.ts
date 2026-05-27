/**
 * Categoria de produtos gerida pelo administrador.
 * Corresponde ao schema `Category` do backend.
 */
export interface Category {
  _id: string;
  name: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}
