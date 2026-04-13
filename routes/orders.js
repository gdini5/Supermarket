const express = require('express');
const router  = express.Router();

// Placeholder — Membro C implementa este módulo
router.get('/', (req, res) => {
  res.render('orders/index', { orders: [], title: 'Encomendas' });
});

module.exports = router;