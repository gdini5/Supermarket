const express = require('express');
const router  = express.Router();

router.get('/', (req, res) => {
  if (!req.session.userId) return res.redirect('/auth/login');
  const role = req.session.role;
  if (role === 'admin')        return res.redirect('/admin/dashboard');
  if (role === 'supermarket')  return res.redirect('/supermarket/dashboard');
  if (role === 'courier')      return res.redirect('/orders');
  res.redirect('/orders');
});

module.exports = router;