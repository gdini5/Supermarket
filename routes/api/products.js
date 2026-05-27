const express    = require('express');
const router     = express.Router();
const mongoose   = require('mongoose');
const Product    = require('../../models/Product');
const Supermarket = require('../../models/Supermarket');

/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: Catálogo de produtos
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Listar produtos disponíveis (paginado)
 *     tags: [Produtos]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Pesquisa por nome (regex case-insensitive)
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: supermarketId
 *         schema: { type: string }
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [price_asc, price_desc] }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20, maximum: 100 }
 *     responses:
 *       200:
 *         description: Lista paginada de produtos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedProducts'
 */
router.get('/', async (req, res, next) => {
  try {
    const { search, category, supermarketId, sort } = req.query;
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip  = (page - 1) * limit;

    const filter = { active: true, stock: { $gt: 0 } };
    if (category)      filter.category = category;
    if (search)        filter.name     = { $regex: search, $options: 'i' };
    if (supermarketId) {
      if (!mongoose.Types.ObjectId.isValid(supermarketId))
        return res.status(400).json({ error: 'supermarketId inválido.' });
      filter.supermarketId = supermarketId;
    }

    let sortObj = { name: 1 };
    if (sort === 'price_asc')  sortObj = { price: 1 };
    if (sort === 'price_desc') sortObj = { price: -1 };

    const allDocs = await Product.find(filter)
      .populate({ path: 'supermarketId', match: { approved: true, active: true }, select: 'name address' })
      .sort(sortObj);

    const approved = allDocs.filter(p => p.supermarketId !== null);
    const total    = approved.length;
    const products = approved.slice(skip, skip + limit);

    res.json({ products, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /products/compare:
 *   get:
 *     summary: Comparar preços de um produto entre supermercados
 *     tags: [Produtos]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema: { type: string }
 *         description: Nome do produto a comparar (regex case-insensitive)
 *     responses:
 *       200:
 *         description: Lista de produtos correspondentes ordenada por preço
 *       400:
 *         description: Parâmetro name em falta
 */
router.get('/compare', async (req, res, next) => {
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ error: 'O parâmetro name é obrigatório.' });

    const products = await Product.find({
      name:   { $regex: name, $options: 'i' },
      active: true,
      stock:  { $gt: 0 },
    })
      .populate({ path: 'supermarketId', match: { approved: true, active: true }, select: 'name address' })
      .sort({ price: 1 });

    const approved = products.filter(p => p.supermarketId !== null);
    res.json(approved);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Detalhe de um produto
 *     tags: [Produtos]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Produto não encontrado
 */
router.get('/:id', async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ error: 'ID de produto inválido.' });

    const product = await Product.findOne({ _id: req.params.id, active: true })
      .populate({ path: 'supermarketId', match: { approved: true, active: true }, select: 'name address deliveryMethods' });

    if (!product || !product.supermarketId)
      return res.status(404).json({ error: 'Produto não encontrado.' });

    res.json(product);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
