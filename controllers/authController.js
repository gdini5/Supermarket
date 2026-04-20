const User        = require('../models/User');
const Supermarket = require('../models/Supermarket');
 
const AuthController = {};
 
// ── Registo ───────────────────────────────────────────────────────────────────
AuthController.showRegister = (req, res) => {
  res.render('auth/register', { error: null });
};
 
AuthController.register = async (req, res) => {
  try {
    const { name, email, password, confirm, address, phone, role,
            shopName, shopAddress, schedule, vehicle } = req.body;
 
    // Validação server-side: confirmar password (defesa contra POST directo)
    if (password !== confirm)
      return res.render('auth/register', { error: 'As passwords não coincidem.' });
 
    if (password.length < 6)
      return res.render('auth/register', { error: 'A password deve ter pelo menos 6 caracteres.' });
 
    const existing = await User.findOne({ email });
    if (existing)
      return res.render('auth/register', { error: 'Este email já está registado.' });
 
    const user = new User({ name, email, password, address, phone, role });
    await user.save();
 
    // Supermercado: criar documento Supermarket associado (pendente de aprovação)
    if (role === 'supermarket') {
      await new Supermarket({
        userId:   user._id,
        name:     shopName    || name,
        address:  shopAddress || address,
        schedule: schedule    || '',
        approved: false,
        active:   true,
      }).save();
    }
 
    // Guardar sessão completa incluindo userName para a navbar
    req.session.userId   = user._id;
    req.session.role     = user.role;
    req.session.userName = user.name;
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
 
    // Guardar sessão completa incluindo userName para a navbar
    req.session.userId   = user._id;
    req.session.role     = user.role;
    req.session.userName = user.name;
 
    if (user.role === 'admin')        return res.redirect('/admin/dashboard');
    if (user.role === 'supermarket')  return res.redirect('/supermarket/dashboard');
    if (user.role === 'courier')      return res.redirect('/courier/dashboard');
    res.redirect('/client/dashboard');
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