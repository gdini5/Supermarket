const express     = require('express');
const router      = express.Router();
const mongoose    = require('mongoose');
const Supermarket = require('../../models/Supermarket');
const Product     = require('../../models/Product');

/**
 * @swagger
 * tags:
 *   name: Supermercados
 *   description: Supermercados aprovados na plataforma
 */

/**
 * @swagger
 * /supermarkets:
 *   get:
 *     summary: Listar supermercados aprovados e ativos
 *     tags: [Supermercados]
 *     security: []
 *     responses:
 *       200:
 *         description: Lista de supermercados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Supermarket'
 */
router.get('/', async (req, res, next) => {
  try {
    const supermarkets = await Supermarket.find({ approved: true, active: true })
      .sort({ name: 1 });
    res.json(supermarkets);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /supermarkets/{id}:
 *   get:
 *     summary: Detalhe de um supermercado
 *     tags: [Supermercados]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Supermercado encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supermarket'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Supermercado não encontrado
 */
router.get('/:id', async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ error: 'ID de supermercado inválido.' });

    const sm = await Supermarket.findOne({ _id: req.params.id, approved: true, active: true });
    if (!sm) return res.status(404).json({ error: 'Supermercado não encontrado.' });

    res.json(sm);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /supermarkets/{id}/products:
 *   get:
 *     summary: Produtos disponíveis de um supermercado
 *     tags: [Supermercados]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [price_asc, price_desc] }
 *     responses:
 *       200:
 *         description: Lista de produtos do supermercado
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Supermercado não encontrado
 */
router.get('/:id/products', async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ error: 'ID de supermercado inválido.' });

    const sm = await Supermarket.findOne({ _id: req.params.id, approved: true, active: true });
    if (!sm) return res.status(404).json({ error: 'Supermercado não encontrado.' });

    const filter = { supermarketId: sm._id, active: true, stock: { $gt: 0 } };
    if (req.query.category) filter.category = req.query.category;

    let sortObj = { name: 1 };
    if (req.query.sort === 'price_asc')  sortObj = { price: 1 };
    if (req.query.sort === 'price_desc') sortObj = { price: -1 };

    const products = await Product.find(filter).sort(sortObj);
    res.json(products);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
