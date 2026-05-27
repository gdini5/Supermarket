const express  = require('express');
const router   = express.Router();
const Category = require('../../models/Category');

/**
 * @swagger
 * tags:
 *   name: Categorias
 *   description: Categorias de produtos geridas pelo admin
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Listar categorias ativas
 *     tags: [Categorias]
 *     security: []
 *     responses:
 *       200:
 *         description: Lista de categorias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find({ active: true }).sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
