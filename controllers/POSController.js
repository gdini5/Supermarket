const User        = require('../models/User');
const Order       = require('../models/Order');
const { ORDER_STATUS } = require('../models/Order');
const Product     = require('../models/Product');
const Supermarket = require('../models/Supermarket');
const bcrypt      = require('bcryptjs');
 
const POSController = {};
 
POSController.show = async (req, res) => {
  try {
    const sm = await Supermarket.findOne({ userId: req.session.userId, active: true, approved: true });
    if (!sm) return res.render('error', { message: 'Supermercado não aprovado ou não encontrado.' });
    const products = await Product.find({ supermarketId: sm._id, active: true, stock: { $gt: 0 } });
    res.render('supermarkets/pos', { sm, products, error: null, success: null });
  } catch (err) {
    res.render('error', { message: 'Erro ao carregar POS.' });
  }
};
 
POSController.registerSale = async (req, res) => {
  const sm = await Supermarket.findOne({ userId: req.session.userId, active: true, approved: true });
  if (!sm) return res.render('error', { message: 'Supermercado não encontrado.' });
 
  const reload = async (error, success = null) => {
    const products = await Product.find({ supermarketId: sm._id, active: true, stock: { $gt: 0 } });
    return res.render('supermarkets/pos', { sm, products, error, success });
  };
 
  try {
    const { clientEmail, clientName, clientPhone, items: rawItems } = req.body;
 
    const itemsArray  = Array.isArray(rawItems) ? rawItems : (rawItems ? [rawItems] : []);
    const parsedItems = itemsArray
      .filter(i => i && i.productId && parseInt(i.quantity) > 0)
      .map(i => ({ productId: i.productId, quantity: parseInt(i.quantity) }));
 
    if (parsedItems.length === 0) return reload('Adiciona pelo menos um produto à venda.');
 
    // Upsert do cliente (cria conta temporária se não existir)
    let client = await User.findOne({ email: clientEmail });
    if (!client) {
      if (!clientName || !clientPhone)
        return reload('Para um novo cliente, preenche o nome e o telefone.');
      const tempPw = await bcrypt.hash('temp_' + Date.now(), 10);
      client = await User.create({
        name:     clientName,
        email:    clientEmail,
        password: tempPw,
        phone:    clientPhone,
        address:  'Registo em loja',
        role:     'client'
      });
    }
 
    // Decremento atómico + snapshot (com rollback)
    const orderItems = [];
    for (const item of parsedItems) {
      const updated = await Product.findOneAndUpdate(
        { _id: item.productId, supermarketId: sm._id, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
      if (!updated) {
        for (const done of orderItems)
          await Product.findByIdAndUpdate(done.productId, { $inc: { stock: done.quantity } });
        return reload('Stock insuficiente para um dos produtos selecionados.');
      }
      orderItems.push({ productId: updated._id, name: updated.name, price: updated.price, quantity: item.quantity });
    }
 
    const total = orderItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
 
    await Order.create({
      clientId: client._id, supermarketId: sm._id,
      items: orderItems, total,
      deliveryMethod: 'pickup', deliveryCost: 0,
      status: ORDER_STATUS.DELIVERED, confirmedAt: new Date()
    });
 
    return reload(null, `Venda de ${total.toFixed(2)} € registada para ${client.email}.`);
  } catch (err) {
    console.error(err);
    return reload('Erro interno ao registar venda.');
  }
};
 
module.exports = POSController;