const User        = require('../models/User');
const Supermarket = require('../models/Supermarket');
 
const AuthController = {};
 
// ── Registo ───────────────────────────────────────────────────────────────────
AuthController.showRegister = (req, res) => {
  res.render('auth/register', { error: null });
};
 
AuthController.register = async (req, res) => {
  try {
    const { name, email, password, address, phone, role,
            shopName, shopAddress, schedule, vehicle } = req.body;
 
    const existing = await User.findOne({ email });
    if (existing)
      return res.render('auth/register', { error: 'Este email já está registado.' });
 
    const user = new User({ name, email, password, address, phone, role });
    await user.save();
 
    // Supermercado: criar o documento Supermarket associado (pendente de aprovação)
    if (role === 'supermarket') {
      const sm = new Supermarket({
        userId:      user._id,
        name:        shopName    || name,
        address:     shopAddress || address,
        schedule:    schedule    || '',
        approved:    false,
        active:      true,
      });
      await sm.save();
    }
 
    // Estafeta: guardar veículo no perfil (campo extra opcional)
    // Pode ser expandido pelo Membro C quando implementar o módulo de estafetas
 
    req.session.userId = user._id;
    req.session.role   = user.role;
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('auth/register', { error: 'Erro ao criar conta. Tenta novamente.' });
  }
};
 
// ── Login ─────────────────────────────────────────────────────────────────────
AuthController.showLogin = (req, res) => {
  res.render('auth/login', { error: null });
};
 
AuthController.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
 
    if (!user || !(await user.comparePassword(password)))
      return res.render('auth/login', { error: 'Email ou password incorretos.' });
 
    if (!user.active)
      return res.render('auth/login', { error: 'Esta conta está desativada.' });
 
    req.session.userId = user._id;
    req.session.role   = user.role;
 
    if (user.role === 'admin')       return res.redirect('/admin/dashboard');
    if (user.role === 'supermarket') return res.redirect('/supermarket/dashboard');
    res.redirect('/orders');
  } catch (err) {
    console.error(err);
    res.render('auth/login', { error: 'Erro ao autenticar. Tenta novamente.' });
  }
};
 
// ── Logout ────────────────────────────────────────────────────────────────────
AuthController.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/auth/login'));
};
 
module.exports = AuthController;