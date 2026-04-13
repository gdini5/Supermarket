const User = require('../models/User');

const AuthController = {};

// ── Registo ───────────────────────────────────────────────────────────────────
AuthController.showRegister = (req, res) => {
  res.render('auth/register', { error: null });
};

AuthController.register = async (req, res) => {
  try {
    const { name, email, password, address, phone, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.render('auth/register', { error: 'Este email já está registado.' });
    }

    // O hash é feito automaticamente pelo pre-save hook do Schema
    const user = new User({ name, email, password, address, phone, role });
    await user.save();

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

    if (!user || !(await user.comparePassword(password))) {
      return res.render('auth/login', { error: 'Email ou password incorretos.' });
    }
    if (!user.active) {
      return res.render('auth/login', { error: 'Esta conta está desativada.' });
    }

    req.session.userId = user._id;
    req.session.role   = user.role;

    // Redirecionar para a área correta conforme o role
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
