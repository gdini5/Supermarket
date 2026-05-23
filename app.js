require('dotenv').config();
const express        = require('express');
const mongoose       = require('mongoose');
const session        = require('express-session');
const MongoStore     = require('connect-mongo');
const methodOverride = require('method-override');
const path           = require('path');
const logger         = require('morgan');
const cors           = require('cors');
const helmet         = require('helmet');
const swaggerUi      = require('swagger-ui-express');
const swaggerSpec    = require('./config/swagger');
const mongoSanitize  = require('express-mongo-sanitize');

// ── Ligação ao MongoDB (usa sempre o .env — nunca hardcode aqui) ──────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✔  MongoDB ligado'))
  .catch(err => { console.error('✘  Erro MongoDB:', err); process.exit(1); });

const app = express();

// ── Segurança e CORS (antes de tudo) ─────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));

app.use(cors({
  origin: [
    'http://localhost:4200',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ── View engine ───────────────────────────────────────────────────────────────
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ── Middlewares globais ───────────────────────────────────────────────────────
app.use(logger('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(mongoSanitize()); // previne NoSQL injection (remove $ e . dos inputs)
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// ── Sessões ───────────────────────────────────────────────────────────────────
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: {
    maxAge:   1000 * 60 * 60 * 24,
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  }
}));

// ── Variáveis locais disponíveis em TODAS as views ────────────────────────────
app.use((req, res, next) => {
  res.locals.currentUser = req.session?.userId   ?? null;
  res.locals.currentRole = req.session?.role     ?? null;
  res.locals.currentName = req.session?.userName ?? null;
  next();
});

// ── Swagger UI ────────────────────────────────────────────────────────────────
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

// ── REST API ──────────────────────────────────────────────────────────────────
app.use('/api/v1', require('./routes/api'));

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