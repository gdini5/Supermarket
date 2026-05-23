const express               = require('express');
const router                = express.Router();
const SupermarketController = require('../controllers/SupermarketController');
const POSController         = require('../controllers/POSController');

router.get('/dashboard', SupermarketController.dashboard);
router.get('/pos',       POSController.show);
router.post('/pos/sale', POSController.registerSale);

// Métodos de entrega
router.get('/delivery',  SupermarketController.editDelivery);
router.post('/delivery', SupermarketController.updateDelivery);

// Localização (coordenadas para o mapa)
router.get('/location',  SupermarketController.editLocation);
router.post('/location', SupermarketController.updateLocation);

module.exports = router;
