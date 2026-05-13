/**
 * Middleware de erro global para a REST API.
 * Devolve sempre JSON no formato { error, stack? }.
 */
module.exports = (err, req, res, next) => {
  console.error('[API Error]', err.message);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Erro interno do servidor.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
