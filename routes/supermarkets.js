const express    = require('express');
const router     = express.Router();

// Placeholder — Membro B implementa este módulo
router.get('/dashboard', (req, res) => {
  res.render('supermarkets/dashboard', { title: 'Dashboard Supermercado' });
});

module.exports = router;
