// Roles de utilizador — usar SEMPRE estas constantes, nunca strings soltas
const ROLES = {
  CLIENT:       'client',
  SUPERMARKET:  'supermarket',
  COURIER:      'courier',
  ADMIN:        'admin',
};

// Estados de encomenda — ordem do ciclo de vida
const ORDER_STATUS = {
  PENDING:    'pending',
  CONFIRMED:  'confirmed',
  PREPARING:  'preparing',
  DELIVERING: 'delivering',
  DELIVERED:  'delivered',
  CANCELLED:  'cancelled',
};

// Categorias de produtos — lista única para o Schema e para os formulários
const PRODUCT_CATEGORIES = [
  'Frutas e Legumes',
  'Carne',
  'Peixe',
  'Bebidas',
  'Produtos de Limpeza',
  'Padaria',
  'Outros',
];

// Métodos de entrega
const DELIVERY_METHODS = {
  PICKUP:  'pickup',
  COURIER: 'courier',
};

// Chaves da sessão — todos usam estas, nunca escrevem a string diretamente
const SESSION_KEYS = {
  USER_ID: 'userId',
  ROLE:    'role',
};

// Regras de negócio
const BUSINESS_RULES = {
  CANCEL_WINDOW_MS: 5 * 60 * 1000, // 5 minutos em milissegundos
};

module.exports = { ROLES, ORDER_STATUS, PRODUCT_CATEGORIES, DELIVERY_METHODS, SESSION_KEYS, BUSINESS_RULES };