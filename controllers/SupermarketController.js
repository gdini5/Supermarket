const Supermarket            = require('../models/Supermarket');
const Product                = require('../models/Product');
const Order                  = require('../models/Order');
const { ORDER_STATUS }       = require('../models/Order');
 
const SupermarketController = {};
 
SupermarketController.dashboard = async (req, res) => {
  try {
    const sm = await Supermarket.findOne({ userId: req.session.userId });
    if (!sm) return res.render('error', { message: 'Supermercado não encontrado.' });
 
    const [totalOrders, totalProducts, pendingOrders, topProducts] = await Promise.all([
      Order.countDocuments({ supermarketId: sm._id }),
      Product.countDocuments({ supermarketId: sm._id, active: true }),
      Order.countDocuments({
        supermarketId: sm._id,
        status: { $in: [ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED, ORDER_STATUS.PREPARING] }
      }),
      Order.aggregate([
        { $match: { supermarketId: sm._id } },
        { $unwind: '$items' },
        { $group: { _id: '$items.name', total: { $sum: '$items.quantity' } } },
        { $sort: { total: -1 } },
        { $limit: 5 }
      ])
    ]);
 
    res.render('supermarkets/dashboard', { sm, totalOrders, totalProducts, pendingOrders, topProducts });
  } catch (err) {
    console.error(err);
    res.render('error', { message: 'Erro ao carregar dashboard.' });
  }
};
 
module.exports = SupermarketController;