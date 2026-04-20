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
      recentOrders,
      ORDER_STATUS
    });
  } catch (err) {
    console.error(err);
    res.render('error', { message: 'Erro ao carregar dashboard.' });
  }
};
 
module.exports = ClientController;