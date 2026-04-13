require('dotenv').config();
const mongoose = require('mongoose');
const User     = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const existing = await User.findOne({ role: 'admin' });
    if (existing) {
      console.log('Admin já existe — nada a fazer.');
      return process.exit(0);
    }

    const admin = new User({
      name:     'Administrador',
      email:    'admin@marketplace.pt',
      password: 'admin123',
      address:  'Sede da Plataforma',
      phone:    '910000000',
      role:     'admin'
    });

    await admin.save();
    console.log('Admin criado:  admin@marketplace.pt  /  admin123');
    process.exit(0);
  })
  .catch(err => { console.error(err); process.exit(1); });