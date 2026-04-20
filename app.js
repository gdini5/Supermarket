require('dotenv').config();
const express        = require('express');
const mongoose       = require('mongoose');
const session        = require('express-session');
const MongoStore     = require('connect-mongo');
const methodOverride = require('method-override');
const path           = require('path');
const logger         = require('morgan');

// ── Ligação ao MongoDB (usa sempre o .env — nunca hardcode aqui) ──────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✔  MongoDB ligado'))
  .catch(err => { console.error('✘  Erro MongoDB:', err); process.exit(1); });

const app = express();

// ── View engine ───────────────────────────────────────────────────────────────
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ── Middlewares globais ───────────────────────────────────────────────────────
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// ── Sessões ───────────────────────────────────────────────────────────────────
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 horas
}));

// ── Variáveis locais disponíveis em TODAS as views ────────────────────────────
app.use((req, res, next) => {
  res.locals.currentUser = req.session?.userId   ?? null;
  res.locals.currentRole = req.session?.role     ?? null;
  res.locals.currentName = req.session?.userName ?? null;
  next();
});

// ── Rotas ─────────────────────────────────────────────────────────────────────
const { requireRole } = require('./middleware/auth');

app.use('/',            require('./routes/index'));
app.use('/auth',        require('./routes/auth'));
app.use('/admin',       requireRole('admin'),                   require('./routes/admin'));
app.use('/supermarket', requireRole('supermarket'),             require('./routes/supermarkets'));
app.use('/products',    requireRole('supermarket', 'admin'),    require('./routes/products'));
app.use('/client',      requireRole('client'),                  require('./routes/client'));
app.use('/courier',     requireRole('courier'),                 require('./routes/courier'));
app.use('/orders',      require('./routes/orders'));

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).render('error', { message: 'Página não encontrada.' });
});

// ── Erro genérico ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).render('error', { message: err.message || 'Erro interno.' });
});

// ── Arranque ──────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✔  Servidor em http://localhost:${PORT}`));

module.exports = app;