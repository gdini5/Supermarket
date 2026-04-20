const express         = require('express');
const router          = express.Router();
const AdminController = require('../controllers/AdminController');

router.get('/dashboard',                    AdminController.dashboard);
router.get('/supermarkets',                 AdminController.listSupermarkets);
router.post('/supermarkets/:id/approve',    AdminController.approve);
router.post('/supermarkets/:id/reject',     AdminController.reject);
router.get('/users',                        AdminController.listUsers);
router.post('/users/:id/toggle',            AdminController.toggleUser);

module.exports = router;
