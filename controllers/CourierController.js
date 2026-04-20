const Order          = require('../models/Order');
const { ORDER_STATUS } = require('../models/Order');
 
const CourierController = {};
 
CourierController.dashboard = async (req, res) => {
  try {
    const uid = req.session.userId;
 
    const [totalDeliveries, activeDelivery, available, topSupermarkets] = await Promise.all([
      Order.countDocuments({ courierId: uid, status: ORDER_STATUS.DELIVERED }),
 
      Order.findOne({ courierId: uid, status: ORDER_STATUS.DELIVERING })
        .populate('supermarketId', 'name address')
        .populate('clientId',      'name'),
 
      Order.find({ status: ORDER_STATUS.PREPARING, deliveryMethod: 'courier', courierId: null })
        .populate('supermarketId', 'name address')
        .populate('clientId',      'name')
        .sort({ createdAt: 1 })
        .limit(20),
 
      Order.aggregate([
        { $match: { courierId: uid, status: ORDER_STATUS.DELIVERED } },
        { $lookup: { from: 'supermarkets', localField: 'supermarketId', foreignField: '_id', as: 'sm' } },
        { $unwind: '$sm' },
        { $group: { _id: '$sm.name', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ])
    ]);
 
    res.render('courier/dashboard', {
      totalDeliveries,
      activeDelivery,
      available,
      availableCount: available.length,
      topSupermarkets
    });
  } catch (err) {
    console.error(err);
    res.render('error', { message: 'Erro ao carregar dashboard.' });
  }
};
 
module.exports = CourierController;