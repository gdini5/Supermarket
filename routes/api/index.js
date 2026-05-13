const express = require('express');
const router  = express.Router();

router.use('/auth',         require('./auth'));
router.use('/products',     require('./products'));
router.use('/supermarkets', require('./supermarkets'));
router.use('/orders',       require('./orders'));
router.use('/cart',         require('./cart'));
router.use('/categories',   require('./categories'));
router.use('/admin',        require('./admin'));

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verificar disponibilidade da API
 *     tags: [Health]
 *     security: []
 *     responses:
 *       200:
 *         description: API disponível
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:    { type: string, example: ok }
 *                 timestamp: { type: string, format: date-time }
 */
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.use(require('../../middleware/apiErrorHandler'));

module.exports = router;
