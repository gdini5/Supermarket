const express               = require('express');
const router                = express.Router();
const SupermarketController = require('../controllers/SupermarketController');
const POSController         = require('../controllers/POSController');
 
router.get('/dashboard', SupermarketController.dashboard);
router.get('/pos',       POSController.show);
router.post('/pos/sale', POSController.registerSale);
 
module.exports = router;