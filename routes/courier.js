const express           = require('express');
const router            = express.Router();
const CourierController = require('../controllers/CourierController');
 
router.get('/dashboard', CourierController.dashboard);
 
module.exports = router;