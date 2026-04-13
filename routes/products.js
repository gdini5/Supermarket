const express = require('express');
const router  = express.Router();

// Placeholder — Membro B implementa este módulo
router.get('/', (req, res) => {
  res.render('products/index', { products: [], title: 'Produtos' });
});

module.exports = router;
