const mongoose = require('mongoose');
 
// Categorias geridas pelo administrador (substituem o array hardcoded)
const CategorySchema = new mongoose.Schema({
  name:   { type: String, required: true, trim: true, unique: true },
  active: { type: Boolean, default: true }
}, { timestamps: true });
 
module.exports = mongoose.model('Category', CategorySchema);