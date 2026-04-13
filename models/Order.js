const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'User',
    required: true
  },
  supermarketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'Supermarket',
    required: true
  },
  courierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'User',
    default: null
  },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name:      { type: String },   // snapshot do nome no momento da compra
    price:     { type: Number },   // snapshot do preço no momento da compra
    quantity:  { type: Number, min: 1 }
  }],
  total:          { type: Number, required: true },
  deliveryMethod: { type: String, enum: ['pickup', 'courier'], required: true },
  deliveryCost:   { type: Number, default: 0 },
  status: {
    type:    String,
    enum:    ['pending', 'confirmed', 'preparing', 'delivering', 'delivered', 'cancelled'],
    default: 'pending'
  },
  confirmedAt: { type: Date }  // usado para a regra dos 5 minutos de cancelamento
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
