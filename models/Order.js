const mongoose        = require('mongoose');
const { DELIVERY_METHODS } = require('../config/constants');
 
// ORDER_STATUS é exclusivo deste modelo — fica aqui
const ORDER_STATUS = {
  PENDING:    'pending',
  CONFIRMED:  'confirmed',
  PREPARING:  'preparing',
  DELIVERING: 'delivering',
  DELIVERED:  'delivered',
  CANCELLED:  'cancelled',
};
 
const OrderSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'User',
    required: true,
  },
  supermarketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'Supermarket',
    required: true,
  },
  courierId: {
    type:    mongoose.Schema.Types.ObjectId,
    ref:     'User',
    default: null,
  },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name:      { type: String },
    price:     { type: Number },
    quantity:  { type: Number, min: 1 },
  }],
  total:          { type: Number, required: true },
  deliveryMethod: { type: String, enum: Object.values(DELIVERY_METHODS), required: true },
  deliveryCost:   { type: Number, default: 0 },
  status: {
    type:    String,
    enum:    Object.values(ORDER_STATUS),
    default: ORDER_STATUS.PENDING,
  },
  confirmedAt: { type: Date },
}, { timestamps: true });
 
module.exports              = mongoose.model('Order', OrderSchema);
module.exports.ORDER_STATUS = ORDER_STATUS;
