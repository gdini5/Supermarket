const mongoose = require('mongoose');

/**
 * Middleware reutilizável que valida um parâmetro de rota como ObjectId Mongo.
 * Retorna 400 se o valor não for um ObjectId válido, prevenindo CastError no Mongoose.
 *
 * @param {string} paramName - Nome do parâmetro em req.params (default: 'id')
 *
 * @example
 * router.get('/:id', validateObjectId(), async (req, res) => { ... });
 * router.get('/:productId', validateObjectId('productId'), async (req, res) => { ... });
 */
module.exports = (paramName = 'id') => (req, res, next) => {
  const value = req.params[paramName];
  if (!mongoose.Types.ObjectId.isValid(value))
    return res.status(400).json({ error: `ID inválido: ${value}` });
  next();
};
