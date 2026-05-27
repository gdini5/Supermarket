const express     = require('express');
const router      = express.Router();
const mongoose    = require('mongoose');
const User        = require('../../models/User');
const Supermarket = require('../../models/Supermarket');
const Order             = require('../../models/Order');
const { ORDER_STATUS }  = require('../../models/Order');
const Category    = require('../../models/Category');
const { apiAuth, requireApiRole } = require('../../middleware/apiAuth');

const adminOnly = [apiAuth, requireApiRole('admin')];

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Endpoints reservados ao administrador
 */

// ── Dashboard ──────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: Estatísticas globais da plataforma
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:           { type: integer }
 *                 activeSupermarkets:   { type: integer }
 *                 totalOrders:          { type: integer }
 *                 pendingSupermarkets:  { type: integer }
 *       403:
 *         description: Sem permissão
 */
router.get('/dashboard', ...adminOnly, async (req, res, next) => {
  try {
    const [totalUsers, activeSupermarkets, totalOrders, pendingSupermarkets] = await Promise.all([
      User.countDocuments({ role: { $ne: 'admin' } }),
      Supermarket.countDocuments({ approved: true, active: true }),
      Order.countDocuments(),
      Supermarket.countDocuments({ approved: false, active: true }),
    ]);
    res.json({ totalUsers, activeSupermarkets, totalOrders, pendingSupermarkets });
  } catch (err) {
    next(err);
  }
});

// ── Supermercados ──────────────────────────────────────────────────────────────

/**
 * @swagger
 * /admin/supermarkets:
 *   get:
 *     summary: Listar todos os supermercados
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista completa de supermercados
 */
router.get('/supermarkets', ...adminOnly, async (req, res, next) => {
  try {
    const supermarkets = await Supermarket.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(supermarkets);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /admin/supermarkets/{id}/approve:
 *   patch:
 *     summary: Aprovar supermercado
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Supermercado aprovado
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Supermercado não encontrado
 */
router.patch('/supermarkets/:id/approve', ...adminOnly, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ error: 'ID inválido.' });

    const sm = await Supermarket.findByIdAndUpdate(
      req.params.id,
      { approved: true, active: true },
      { new: true }
    );
    if (!sm) return res.status(404).json({ error: 'Supermercado não encontrado.' });
    res.json(sm);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /admin/supermarkets/{id}/reject:
 *   patch:
 *     summary: Rejeitar supermercado
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Supermercado rejeitado
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Supermercado não encontrado
 */
router.patch('/supermarkets/:id/reject', ...adminOnly, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ error: 'ID inválido.' });

    const sm = await Supermarket.findByIdAndUpdate(
      req.params.id,
      { approved: false, active: false },
      { new: true }
    );
    if (!sm) return res.status(404).json({ error: 'Supermercado não encontrado.' });
    res.json(sm);
  } catch (err) {
    next(err);
  }
});

// ── Utilizadores ───────────────────────────────────────────────────────────────

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Listar utilizadores (excluindo admins)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de utilizadores sem password
 */
router.get('/users', ...adminOnly, async (req, res, next) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /admin/users/{id}/toggle:
 *   patch:
 *     summary: Ativar ou desativar conta de utilizador
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Estado do utilizador alterado
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Utilizador não encontrado
 */
router.patch('/users/:id/toggle', ...adminOnly, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ error: 'ID inválido.' });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Utilizador não encontrado.' });

    user.active = !user.active;
    await user.save();

    const { password: _pw, ...safeUser } = user.toObject();
    res.json(safeUser);
  } catch (err) {
    next(err);
  }
});

// ── Encomendas ─────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /admin/orders:
 *   get:
 *     summary: Monitorizar todas as encomendas
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [pending, confirmed, preparing, delivering, delivered, cancelled] }
 *     responses:
 *       200:
 *         description: Lista de encomendas
 */
router.get('/orders', ...adminOnly, async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const orders = await Order.find(filter)
      .populate('clientId',      'name email')
      .populate('supermarketId', 'name')
      .populate('courierId',     'name')
      .sort({ createdAt: -1 })
      .limit(200);

    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// ── Categorias ─────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /admin/categories:
 *   get:
 *     summary: Listar todas as categorias
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorias
 */
router.get('/categories', ...adminOnly, async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /admin/categories:
 *   post:
 *     summary: Criar nova categoria
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *     responses:
 *       201:
 *         description: Categoria criada
 *       400:
 *         description: Nome em falta
 *       409:
 *         description: Categoria já existe
 */
router.post('/categories', ...adminOnly, async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim())
      return res.status(400).json({ error: 'O nome da categoria é obrigatório.' });

    const exists = await Category.findOne({ name: name.trim() });
    if (exists)
      return res.status(409).json({ error: 'Já existe uma categoria com esse nome.' });

    const category = await Category.create({ name: name.trim() });
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /admin/categories/{id}/toggle:
 *   patch:
 *     summary: Ativar ou desativar categoria
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Estado da categoria alterado
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Categoria não encontrada
 */
router.patch('/categories/:id/toggle', ...adminOnly, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ error: 'ID inválido.' });

    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ error: 'Categoria não encontrada.' });

    cat.active = !cat.active;
    await cat.save();
    res.json(cat);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /admin/categories/{id}:
 *   delete:
 *     summary: Eliminar categoria
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Categoria eliminada
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Categoria não encontrada
 */
router.delete('/categories/:id', ...adminOnly, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ error: 'ID inválido.' });

    const cat = await Category.findByIdAndDelete(req.params.id);
    if (!cat) return res.status(404).json({ error: 'Categoria não encontrada.' });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
