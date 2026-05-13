const jwt = require('jsonwebtoken');

/**
 * Verifica o token JWT no header Authorization: Bearer <token>.
 * Injeta req.apiUser = { userId, role, userName } se válido.
 */
const apiAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer '))
    return res.status(401).json({ error: 'Token em falta ou formato inválido.' });

  try {
    const token = header.slice(7);
    req.apiUser = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError')
      return res.status(401).json({ error: 'Token expirado. Faz login novamente.' });
    return res.status(401).json({ error: 'Token inválido.' });
  }
};

/**
 * Factory que exige um ou mais roles específicos.
 * Usar sempre depois de apiAuth.
 * @param {...string} roles
 */
const requireApiRole = (...roles) => (req, res, next) => {
  if (!req.apiUser)
    return res.status(401).json({ error: 'Não autenticado.' });
  if (!roles.includes(req.apiUser.role))
    return res.status(403).json({ error: 'Sem permissão para este recurso.' });
  next();
};

module.exports = { apiAuth, requireApiRole };
