const express             = require('express');
const router              = express.Router();
const OrderController     = require('../controllers/OrderController');
const { isAuthenticated } = require('../middleware/auth');
 
// Loja pública — não precisa de autenticação para ver
router.get('/shop',                  OrderController.shop);
 
// Carrinho — precisa de sessão
router.get('/cart',                  isAuthenticated, OrderController.getCart);
router.post('/cart/add/:productId',  isAuthenticated, OrderController.addToCart);
router.post('/cart/update',          isAuthenticated, OrderController.updateCart);
router.post('/cart/clear',           isAuthenticated, OrderController.clearCart);
 
// Checkout e encomendas
router.post('/checkout',             isAuthenticated, OrderController.checkout);
router.get('/',                      isAuthenticated, OrderController.list);
router.get('/:id',                   isAuthenticated, OrderController.show);
router.post('/:id/status',           isAuthenticated, OrderController.updateStatus);
 
module.exports = router;