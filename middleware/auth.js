// Verifica se o utilizador tem sessão ativa
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) return next();
  res.redirect('/auth/login');
};

// Verifica se o utilizador tem um dos roles permitidos
// Uso: requireRole('admin')  ou  requireRole('supermarket', 'admin')
const requireRole = (...roles) => (req, res, next) => {
  if (!req.session || !req.session.userId) return res.redirect('/auth/login');
  if (!roles.includes(req.session.role)) {
    return res.status(403).render('error', { message: 'Acesso negado.' });
  }
  next();
};

module.exports = { isAuthenticated, requireRole };