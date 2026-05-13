const mongoose = require('mongoose');
 
// Unidades de preço suportadas
const PRICE_UNITS = ['un.', 'kg', 'lt', 'cx'];
 
const ProductSchema = new mongoose.Schema({
  supermarketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'Supermarket',
    required: true,
  },
  name:        { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  // category agora é string livre (vem do modelo Category gerido pelo admin)
  category:    { type: String, required: true, trim: true },
  price:       { type: Number, required: true, min: 0 },
  priceUnit:   { type: String, enum: PRICE_UNITS, default: 'un.' },
  stock:       { type: Number, required: true, min: 0, default: 0 },
  image:       { type: String, default: 'default-product.png' },
  active:      { type: Boolean, default: true },
}, { timestamps: true });
 
module.exports            = mongoose.model('Product', ProductSchema);
module.exports.PRICE_UNITS = PRICE_UNITS;