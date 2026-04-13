// Roles de utilizador — usar SEMPRE estas constantes, nunca strings soltas
const ROLES = {
  CLIENT:      'client',
  SUPERMARKET: 'supermarket',
  COURIER:     'courier',
  ADMIN:       'admin',
};
 
// Métodos de entrega — usados em Supermarket, Order e views
const DELIVERY_METHODS = {
  PICKUP:  'pickup',
  COURIER: 'courier',
};
 
// Chaves da sessão — todos os membros usam estas, nunca a string direta
const SESSION_KEYS = {
  USER_ID: 'userId',
  ROLE:    'role',
};
 
// Regras de negócio globais
const BUSINESS_RULES = {
  CANCEL_WINDOW_MS: 5 * 60 * 1000, // 5 minutos para cancelar encomenda
};
 
module.exports = { ROLES, DELIVERY_METHODS, SESSION_KEYS, BUSINESS_RULES };