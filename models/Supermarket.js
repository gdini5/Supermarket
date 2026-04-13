const mongoose             = require('mongoose');
const { DELIVERY_METHODS } = require('../config/constants');
 
const SupermarketSchema = new mongoose.Schema({
  userId: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true,
  },
  name:        { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  address:     { type: String, required: true, trim: true },
  schedule:    { type: String, trim: true }, // ex: 'Seg-Sex 8h-20h'
  deliveryMethods: [{
    type: { type: String, enum: Object.values(DELIVERY_METHODS) },
    cost: { type: Number, default: 0 },
  }],
  approved: { type: Boolean, default: false },
  active:   { type: Boolean, default: true },
}, { timestamps: true });
 
module.exports = mongoose.model('Supermarket', SupermarketSchema);