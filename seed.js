require('dotenv').config();
const mongoose = require('mongoose');
const User     = require('./models/User');
const Category = require('./models/Category');
 
const DEFAULT_CATEGORIES = [
  'Frutas e Legumes', 'Carne', 'Peixe',
  'Bebidas', 'Produtos de Limpeza', 'Padaria', 'Outros'
];
 
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
 
    // ── Admin ────────────────────────────────────────────────────────────────
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (!existingAdmin) {
      const admin = new User({
        name: 'Administrador', email: 'admin@marketplace.pt',
        password: 'admin123', address: 'Sede da Plataforma',
        phone: '910000000', role: 'admin'
      });
      await admin.save();
      console.log('✔ Admin criado:  admin@marketplace.pt  /  admin123');
    } else {
      console.log('ℹ Admin já existe — ignorado.');
    }
 
    // ── Categorias padrão ────────────────────────────────────────────────────
    let criadas = 0;
    for (const name of DEFAULT_CATEGORIES) {
      const exists = await Category.findOne({ name });
      if (!exists) {
        await Category.create({ name, active: true });
        criadas++;
      }
    }
    if (criadas > 0) console.log(`✔ ${criadas} categoria(s) padrão criadas.`);
    else             console.log('ℹ Categorias padrão já existem — ignoradas.');
 
    process.exit(0);
  })
  .catch(err => { console.error(err); process.exit(1); });