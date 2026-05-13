/**
 * ═══════════════════════════════════════════════════════════════════════════
 * AdminController.js — Painel de administração
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Ações reservadas ao admin:
 *
 *   • dashboard          — estatísticas gerais da plataforma (req. 9d).
 *   • listSupermarkets   — lista de supermercados com estado de aprovação.
 *   • approve/reject     — aprovar (approved=true) ou rejeitar um supermercado
 *                          (req. 2b). Supermercado rejeitado fica active=false.
 *   • deleteSupermarket  — desativa o utilizador associado e apaga o
 *                          supermercado (preserva encomendas históricas).
 *   • listUsers          — gestão de utilizadores (clientes, estafetas).
 *   • toggleUser         — ativar/desativar contas.
 *   • deleteUser         — eliminar utilizador (cascade ao supermercado associado).
 *   • listCategories / createCategory / toggleCategory / deleteCategory
 *                          — CRUD de categorias de produtos.
 *   • listOrders         — monitorização global de todas as encomendas
 *                          com filtro por estado.
 */

const User        = require('../models/User');
const Supermarket = require('../models/Supermarket');
const Order            = require('../models/Order');
const { ORDER_STATUS } = require('../models/Order');
const Category    = require('../models/Category');
 
const AdminController = {};
 
// ── Dashboard ─────────────────────────────────────────────────────────────────
AdminController.dashboard = async (req, res) => {
  try {
    const [totalUsers, activeSupermarkets, totalOrders, pendingSupermarkets] =
      await Promise.all([
        User.countDocuments({ role: { $ne: 'admin' } }),
        Supermarket.countDocuments({ approved: true, active: true }),
        Order.countDocuments(),
        Supermarket.countDocuments({ approved: false, active: true })
      ]);
    res.render('admin/dashboard', { totalUsers, activeSupermarkets, totalOrders, pendingSupermarkets });
  } catch (err) {
    console.error(err);
    res.render('error', { message: 'Erro ao carregar dashboard.' });
  }
};
 
// ── Supermercados ─────────────────────────────────────────────────────────────
AdminController.listSupermarkets = async (req, res) => {
  try {
    const supermarkets = await Supermarket.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.render('admin/supermarkets', { supermarkets });
  } catch (err) {
    res.render('error', { message: 'Erro ao listar supermercados.' });
  }
};
 
AdminController.approve = async (req, res) => {
  try {
    await Supermarket.findByIdAndUpdate(req.params.id, { approved: true, active: true });
    res.redirect('/admin/supermarkets');
  } catch (err) {
    res.render('error', { message: 'Erro ao aprovar supermercado.' });
  }
};
 
AdminController.reject = async (req, res) => {
  try {
    await Supermarket.findByIdAndUpdate(req.params.id, { approved: false, active: false });
    res.redirect('/admin/supermarkets');
  } catch (err) {
    res.render('error', { message: 'Erro ao rejeitar supermercado.' });
  }
};
 
AdminController.deleteSupermarket = async (req, res) => {
  try {
    const sm = await Supermarket.findById(req.params.id);
    if (!sm) return res.render('error', { message: 'Supermercado não encontrado.' });
    // Desativa o utilizador proprietário em vez de o apagar (preserva encomendas históricas)
    await User.findByIdAndUpdate(sm.userId, { active: false });
    await Supermarket.findByIdAndDelete(req.params.id);
    res.redirect('/admin/supermarkets');
  } catch (err) {
    res.render('error', { message: 'Erro ao eliminar supermercado.' });
  }
};
 
// ── Utilizadores ──────────────────────────────────────────────────────────────
AdminController.listUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).sort({ createdAt: -1 });
    res.render('admin/users', { users });
  } catch (err) {
    res.render('error', { message: 'Erro ao listar utilizadores.' });
  }
};
 
AdminController.toggleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.render('error', { message: 'Utilizador não encontrado.' });
    user.active = !user.active;
    await user.save();
    res.redirect('/admin/users');
  } catch (err) {
    res.render('error', { message: 'Erro ao atualizar utilizador.' });
  }
};
 
AdminController.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.render('error', { message: 'Utilizador não encontrado.' });
    // Se for supermercado, remove também o documento Supermarket
    if (user.role === 'supermarket')
      await Supermarket.deleteOne({ userId: user._id });
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/admin/users');
  } catch (err) {
    res.render('error', { message: 'Erro ao eliminar utilizador.' });
  }
};
 
// ── Categorias ────────────────────────────────────────────────────────────────
AdminController.listCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.render('admin/categories', { categories, error: null, success: null });
  } catch (err) {
    res.render('error', { message: 'Erro ao listar categorias.' });
  }
};
 
AdminController.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim())
      return res.render('admin/categories', {
        categories: await Category.find().sort({ name: 1 }),
        error: 'O nome da categoria é obrigatório.', success: null
      });
    const exists = await Category.findOne({ name: name.trim() });
    if (exists)
      return res.render('admin/categories', {
        categories: await Category.find().sort({ name: 1 }),
        error: 'Já existe uma categoria com esse nome.', success: null
      });
    await Category.create({ name: name.trim() });
    res.redirect('/admin/categories');
  } catch (err) {
    res.render('error', { message: 'Erro ao criar categoria.' });
  }
};
 
AdminController.toggleCategory = async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.render('error', { message: 'Categoria não encontrada.' });
    cat.active = !cat.active;
    await cat.save();
    res.redirect('/admin/categories');
  } catch (err) {
    res.render('error', { message: 'Erro ao atualizar categoria.' });
  }
};
 
AdminController.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.redirect('/admin/categories');
  } catch (err) {
    res.render('error', { message: 'Erro ao eliminar categoria.' });
  }
};
 
 
// ── Monitorização de Encomendas ───────────────────────────────────────────────
AdminController.listOrders = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('clientId',      'name email')
      .populate('supermarketId', 'name')
      .populate('courierId',     'name')
      .sort({ createdAt: -1 })
      .limit(100);

    res.render('admin/orders', { orders, ORDER_STATUS, status: status || '', search: search || '' });
  } catch (err) {
    console.error(err);
    res.render('error', { message: 'Erro ao listar encomendas.' });
  }
};
 
module.exports = AdminController;
