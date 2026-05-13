/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ClientController.js — Dashboard do cliente
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * dashboard — agrega 5 indicadores num só pedido (via Promise.all):
 *   1. Total de encomendas do cliente (req. 9a.i)
 *   2. Encomendas ativas (pending/confirmed/preparing/delivering)
 *   3. Total gasto em encomendas entregues (agregação sum($total))
 *   4. Top 5 produtos mais comprados (agregação unwind+group)   (req. 9a.ii)
 *   5. 5 encomendas mais recentes com nome do supermercado
 */

const Order          = require('../models/Order');
const { ORDER_STATUS } = require('../models/Order');
 
const ClientController = {};
 
ClientController.dashboard = async (req, res) => {
  try {
    const uid = req.session.userId;
 
    const [totalOrders, activeOrders, spentAgg, topProducts, recentOrders] = await Promise.all([
      Order.countDocuments({ clientId: uid }),
      Order.countDocuments({ clientId: uid, status: { $in: [ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED, ORDER_STATUS.PREPARING, ORDER_STATUS.DELIVERING] } }),
      Order.aggregate([
        { $match: { clientId: uid, status: ORDER_STATUS.DELIVERED } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Order.aggregate([
        { $match: { clientId: uid } },
        { $unwind: '$items' },
        { $group: { _id: '$items.name', total: { $sum: '$items.quantity' } } },
        { $sort: { total: -1 } },
        { $limit: 5 }
      ]),
      Order.find({ clientId: uid })
        .populate('supermarketId', 'name')
        .sort({ createdAt: -1 })
        .limit(5)
    ]);
 
    res.render('client/dashboard', {
      totalOrders,
      activeOrders,
      totalSpent:   spentAgg[0]?.total || 0,
      topProducts,
      recentOrders
    });
  } catch (err) {
    console.error(err);
    res.render('error', { message: 'Erro ao carregar dashboard.' });
  }
};
 
module.exports = ClientController;