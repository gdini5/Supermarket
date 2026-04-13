const mongoose = require('mongoose');

const CATEGORIES = [
  'Frutas e Legumes',
  'Carne',
  'Peixe',
  'Bebidas',
  'Produtos de Limpeza',
  'Padaria',
  'Outros'
];

const ProductSchema = new mongoose.Schema({
  supermarketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'Supermarket',
    required: true
  },
  name:        { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  category:    { type: String, required: true, enum: CATEGORIES },
  price:       { type: Number, required: true, min: 0 },
  stock:       { type: Number, required: true, min: 0, default: 0 },
  image:       { type: String, default: 'default-product.png' },
  active:      { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
module.exports.CATEGORIES = CATEGORIES;