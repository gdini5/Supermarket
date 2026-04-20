const User        = require('../models/User');
const Supermarket = require('../models/Supermarket');
const Order       = require('../models/Order');
 
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
 
    res.render('admin/dashboard', {
      totalUsers,
      activeSupermarkets,
      totalOrders,
      pendingSupermarkets
    });
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
 
module.exports = AdminController;
