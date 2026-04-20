const Order              = require('../models/Order');
const { ORDER_STATUS }   = require('../models/Order');
const Product            = require('../models/Product');
const { PRODUCT_CATEGORIES } = require('../models/Product');
const Supermarket        = require('../models/Supermarket');
const { BUSINESS_RULES } = require('../config/constants');
 
const OrderController = {};
 
OrderController.shop = async (req, res) => {
  try {
    const { search, category, supermarketId } = req.query;
    const filter = { active: true, stock: { $gt: 0 } };
    if (category)      filter.category      = category;
    if (supermarketId) filter.supermarketId = supermarketId;
    if (search)        filter.name          = { $regex: search, $options: 'i' };
 
    const products = await Product.find(filter)
      .populate({ path: 'supermarketId', match: { approved: true, active: true } })
      .sort({ name: 1 });
    const approvedProducts = products.filter(p => p.supermarketId !== null);
    const supermarkets     = await Supermarket.find({ approved: true, active: true }).select('name address');
 
    res.render('orders/shop', {
      products: approvedProducts, supermarkets,
      categories: PRODUCT_CATEGORIES,
      search: search || '', category: category || '', supermarketId: supermarketId || '',
      error: req.query.error || null,
      cart: req.session.cart || { items: [] }
    });
  } catch (err) {
    console.error(err);
    res.render('error', { message: 'Erro ao carregar loja.' });
  }
};
 
OrderController.getCart = (req, res) => {
  const cart = req.session.cart || { items: [], supermarketId: null };
  res.render('orders/cart', { cart });
};
 
OrderController.addToCart = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId)
      .populate({ path: 'supermarketId', match: { approved: true, active: true } });
    if (!product || !product.active || product.stock < 1 || !product.supermarketId)
      return res.redirect('/orders/shop?error=sem_stock');
    if (!req.session.cart) req.session.cart = { items: [], supermarketId: null };
    const cart = req.session.cart;
    if (cart.supermarketId && cart.supermarketId.toString() !== product.supermarketId._id.toString())
      return res.redirect('/orders/shop?error=supermercado_diferente');
    cart.supermarketId = product.supermarketId._id.toString();
    const existing = cart.items.find(i => i.productId === product._id.toString());
    if (existing) {
      existing.quantity = Math.min(existing.quantity + 1, product.stock);
    } else {
      cart.items.push({ productId: product._id.toString(), name: product.name, price: product.price, image: product.image, quantity: 1 });
    }
    res.redirect('/orders/cart');
  } catch (err) { console.error(err); res.redirect('/orders/shop'); }
};
 
OrderController.updateCart = (req, res) => {
  const { productId, quantity } = req.body;
  if (!req.session.cart) return res.redirect('/orders/cart');
  const cart = req.session.cart;
  const qty  = parseInt(quantity);
  if (qty <= 0) {
    cart.items = cart.items.filter(i => i.productId !== productId);
    if (cart.items.length === 0) cart.supermarketId = null;
  } else {
    const item = cart.items.find(i => i.productId === productId);
    if (item) item.quantity = qty;
  }
  res.redirect('/orders/cart');
};
 
OrderController.clearCart = (req, res) => {
  req.session.cart = { items: [], supermarketId: null };
  res.redirect('/orders/cart');
};
 
OrderController.checkout = async (req, res) => {
  try {
    const cart = req.session.cart;
    if (!cart || !cart.items || cart.items.length === 0) return res.redirect('/orders/cart');
    const { deliveryMethod } = req.body;
    const sm = await Supermarket.findOne({ _id: cart.supermarketId, approved: true, active: true });
    if (!sm) return res.render('error', { message: 'Supermercado não encontrado ou não aprovado.' });
    const orderItems = [];
    for (const item of cart.items) {
      const updated = await Product.findOneAndUpdate(
        { _id: item.productId, stock: { $gte: item.quantity }, active: true },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
      if (!updated) {
        for (const done of orderItems)
          await Product.findByIdAndUpdate(done.productId, { $inc: { stock: done.quantity } });
        return res.redirect('/orders/cart?error=stock_insuficiente');
      }
      orderItems.push({ productId: item.productId, name: item.name, price: item.price, quantity: item.quantity });
    }
    const deliveryCostObj = sm.deliveryMethods.find(d => d.type === deliveryMethod);
    const deliveryCost    = deliveryCostObj ? deliveryCostObj.cost : 0;
    const total           = orderItems.reduce((acc, i) => acc + i.price * i.quantity, 0) + deliveryCost;
    const order = await Order.create({
      clientId: req.session.userId, supermarketId: sm._id,
      items: orderItems, total, deliveryMethod, deliveryCost,
      status: ORDER_STATUS.PENDING, confirmedAt: new Date()
    });
    req.session.cart = { items: [], supermarketId: null };
    res.redirect('/orders/' + order._id);
  } catch (err) { console.error(err); res.render('error', { message: 'Erro ao criar encomenda.' }); }
};
 
OrderController.list = async (req, res) => {
  try {
    const role = req.session.role; const uid = req.session.userId;
    const search = req.query.search || ''; const statusFilter = req.query.status || '';
    let filter = {};
    if (role === 'client')       { filter.clientId = uid; }
    else if (role === 'supermarket') { const sm = await Supermarket.findOne({ userId: uid }); if (sm) filter.supermarketId = sm._id; }
    else if (role === 'courier') { filter.courierId = uid; }
    if (statusFilter) filter.status = statusFilter;
    const orders = await Order.find(filter)
      .populate('clientId', 'name email').populate('supermarketId', 'name').sort({ createdAt: -1 });
    res.render('orders/index', { orders, ORDER_STATUS, search, status: statusFilter });
  } catch (err) { console.error(err); res.render('error', { message: 'Erro ao listar encomendas.' }); }
};
 
OrderController.show = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('clientId', 'name email').populate('supermarketId', 'name address userId').populate('courierId', 'name phone');
    if (!order) return res.render('error', { message: 'Encomenda não encontrada.' });
    const uid = req.session.userId.toString(); const role = req.session.role;
    let isOwner = role === 'admin' || order.clientId?._id.toString() === uid;
    if (!isOwner && role === 'supermarket') {
      const sm = await Supermarket.findOne({ userId: uid });
      isOwner = sm?._id.toString() === order.supermarketId?._id?.toString();
    }
    if (!isOwner && role === 'courier') isOwner = order.courierId?._id?.toString() === uid;
    if (!isOwner) return res.render('error', { message: 'Acesso negado.' });
    const canCancel = order.status === ORDER_STATUS.CONFIRMED &&
      (Date.now() - new Date(order.confirmedAt).getTime()) < BUSINESS_RULES.CANCEL_WINDOW_MS;
    res.render('orders/show', { order, canCancel, ORDER_STATUS });
  } catch (err) { console.error(err); res.render('error', { message: 'Erro ao carregar encomenda.' }); }
};
 
OrderController.updateStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.render('error', { message: 'Encomenda não encontrada.' });
    const { status } = req.body; const role = req.session.role;
    if (status === ORDER_STATUS.CANCELLED && role === 'client') {
      const elapsed = Date.now() - new Date(order.confirmedAt).getTime();
      if (elapsed > BUSINESS_RULES.CANCEL_WINDOW_MS)
        return res.render('error', { message: 'O prazo de 5 minutos para cancelar já passou.' });
    }
    const allowed = {
      admin: Object.values(ORDER_STATUS),
      supermarket: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.PREPARING, ORDER_STATUS.CANCELLED],
      courier: [ORDER_STATUS.DELIVERING, ORDER_STATUS.DELIVERED],
      client: [ORDER_STATUS.CANCELLED]
    };
    if (!allowed[role]?.includes(status)) return res.render('error', { message: 'Transição de estado não permitida.' });
    order.status = status;
    if (status === ORDER_STATUS.CONFIRMED)  order.confirmedAt = new Date();
    if (status === ORDER_STATUS.DELIVERING) order.courierId   = req.session.userId;
    await order.save();
    res.redirect('/orders/' + order._id);
  } catch (err) { console.error(err); res.render('error', { message: 'Erro ao atualizar estado.' }); }
};
 
module.exports = OrderController;