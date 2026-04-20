const express          = require('express');
const router           = express.Router();
const ClientController = require('../controllers/ClientController');
 
router.get('/dashboard', ClientController.dashboard);
 
module.exports = router;