const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  address:  { type: String, required: true, trim: true },
  phone:    { type: String, required: true, trim: true },
  role:     { type: String, enum: ['client', 'supermarket', 'courier', 'admin'], default: 'client' },
  vehicle:  { type: String, enum: ['bicycle', 'motorcycle', 'car', 'foot'], default: null },
  active:   { type: Boolean, default: true }
}, { timestamps: true });

// Hash da password antes de qualquer save
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Método de comparação usado no login
UserSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', UserSchema);