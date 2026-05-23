const Supermarket            = require('../models/Supermarket');
const Product                = require('../models/Product');
const Order                  = require('../models/Order');
const { ORDER_STATUS }       = require('../models/Order');
const { DELIVERY_METHODS }   = require('../config/constants');

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

// ── Métodos de entrega ──────────────────────────────────────────────────────

SupermarketController.editDelivery = async (req, res) => {
  try {
    const sm = await Supermarket.findOne({ userId: req.session.userId });
    if (!sm) return res.render('error', { message: 'Supermercado não encontrado.' });

    const current = { pickup: { enabled: false, cost: 0 }, courier: { enabled: false, cost: 0 } };
    (sm.deliveryMethods || []).forEach(m => {
      if (current[m.type]) { current[m.type].enabled = true; current[m.type].cost = m.cost; }
    });

    res.render('supermarkets/delivery', { sm, current, error: null, success: null });
  } catch (err) {
    console.error(err);
    res.render('error', { message: 'Erro ao carregar métodos de entrega.' });
  }
};

SupermarketController.updateDelivery = async (req, res) => {
  try {
    const sm = await Supermarket.findOne({ userId: req.session.userId });
    if (!sm) return res.render('error', { message: 'Supermercado não encontrado.' });

    const { pickupEnabled, pickupCost, courierEnabled, courierCost } = req.body;
    const methods = [];

    if (pickupEnabled === 'on') {
      const cost = parseFloat(pickupCost);
      methods.push({ type: DELIVERY_METHODS.PICKUP, cost: Number.isFinite(cost) && cost >= 0 ? cost : 0 });
    }
    if (courierEnabled === 'on') {
      const cost = parseFloat(courierCost);
      methods.push({ type: DELIVERY_METHODS.COURIER, cost: Number.isFinite(cost) && cost >= 0 ? cost : 0 });
    }

    const current = {
      pickup:  { enabled: pickupEnabled === 'on',  cost: parseFloat(pickupCost)  || 0 },
      courier: { enabled: courierEnabled === 'on', cost: parseFloat(courierCost) || 0 },
    };

    if (methods.length === 0) {
      return res.render('supermarkets/delivery', {
        sm, current, error: 'Tens de ativar pelo menos um método de entrega.', success: null,
      });
    }

    sm.deliveryMethods = methods;
    await sm.save();

    res.render('supermarkets/delivery', {
      sm, current, error: null, success: 'Métodos de entrega atualizados com sucesso.',
    });
  } catch (err) {
    console.error(err);
    res.render('error', { message: 'Erro ao guardar métodos de entrega.' });
  }
};

// ── Localização (coordenadas para o mapa) ───────────────────────────────────

SupermarketController.editLocation = async (req, res) => {
  try {
    const sm = await Supermarket.findOne({ userId: req.session.userId });
    if (!sm) return res.render('error', { message: 'Supermercado não encontrado.' });
    res.render('supermarkets/location', { sm, error: null, success: null });
  } catch (err) {
    console.error(err);
    res.render('error', { message: 'Erro ao carregar a localização.' });
  }
};

SupermarketController.updateLocation = async (req, res) => {
  try {
    const sm = await Supermarket.findOne({ userId: req.session.userId });
    if (!sm) return res.render('error', { message: 'Supermercado não encontrado.' });

    const lat = parseFloat(req.body.lat);
    const lng = parseFloat(req.body.lng);
    const validLat = Number.isFinite(lat) && lat >= -90 && lat <= 90;
    const validLng = Number.isFinite(lng) && lng >= -180 && lng <= 180;

    if (!validLat || !validLng) {
      return res.render('supermarkets/location', {
        sm, error: 'Coordenadas inválidas. Marca um ponto no mapa antes de guardar.', success: null,
      });
    }

    sm.location = { lat, lng };
    await sm.save();

    res.render('supermarkets/location', {
      sm, error: null, success: 'Localização guardada com sucesso. O teu mercado já aparece no mapa.',
    });
  } catch (err) {
    console.error(err);
    res.render('error', { message: 'Erro ao guardar a localização.' });
  }
};

module.exports = SupermarketController;
