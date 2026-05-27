const express   = require('express');
const router    = express.Router();
const jwt       = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const User        = require('../../models/User');
const Supermarket = require('../../models/Supermarket');
const { apiAuth } = require('../../middleware/apiAuth');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas tentativas de login. Tenta novamente em 15 minutos.' },
});

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticação e gestão de sessão JWT
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registar novo utilizador
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, confirm, address, phone, role]
 *             properties:
 *               name:        { type: string }
 *               email:       { type: string, format: email }
 *               password:    { type: string, minLength: 6 }
 *               confirm:     { type: string }
 *               address:     { type: string }
 *               phone:       { type: string }
 *               role:        { type: string, enum: [client, courier] }
 *               shopName:    { type: string, description: Apenas para role=supermarket }
 *               shopAddress: { type: string, description: Apenas para role=supermarket }
 *               schedule:    { type: string, description: Apenas para role=supermarket }
 *     responses:
 *       201:
 *         description: Utilizador criado e token devolvido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: { type: string }
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validação falhou
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Email já registado
 */
router.post('/register', async (req, res, next) => {
  try {
    // Destruturar apenas campos permitidos — sem mass assignment
    const { name, email, password, confirm, address, phone, role,
            shopName, shopAddress, schedule } = req.body;

    if (!name || !email || !password || !confirm || !address || !phone)
      return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });

    if (password !== confirm)
      return res.status(400).json({ error: 'As passwords não coincidem.' });

    if (password.length < 6)
      return res.status(400).json({ error: 'A password deve ter pelo menos 6 caracteres.' });

    // Impedir criação de conta admin via API pública
    const allowedRoles = ['client', 'supermarket', 'courier'];
    const safeRole = allowedRoles.includes(role) ? role : 'client';

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing)
      return res.status(409).json({ error: 'Este email já está registado.' });

    const user = new User({ name, email, password, address, phone, role: safeRole });
    await user.save();

    if (safeRole === 'supermarket') {
      await new Supermarket({
        userId:   user._id,
        name:     shopName    || name,
        address:  shopAddress || address,
        schedule: schedule    || '',
        approved: false,
        active:   true,
      }).save();
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, userName: user.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login — devolve JWT
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:    { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: { type: string }
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Credenciais inválidas ou conta inativa
 *       429:
 *         description: Rate limit atingido
 */
router.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email e password são obrigatórios.' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ error: 'Email ou password incorretos.' });

    if (!user.active)
      return res.status(401).json({ error: 'Esta conta está desativada.' });

    const token = jwt.sign(
      { userId: user._id, role: user.role, userName: user.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout (invalida token no cliente)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout efetuado
 */
router.post('/logout', apiAuth, (req, res) => {
  // JWT é stateless — o cliente descarta o token
  res.json({ message: 'Logout efetuado com sucesso.' });
});

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Dados do utilizador autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do utilizador (sem password)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Não autenticado
 */
router.get('/me', apiAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.apiUser.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'Utilizador não encontrado.' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /auth/me:
 *   patch:
 *     summary: Actualizar dados do utilizador autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:    { type: string }
 *               phone:   { type: string }
 *               address: { type: string }
 *     responses:
 *       200:
 *         description: Utilizador actualizado
 *       401:
 *         description: Não autenticado
 */
router.patch('/me', apiAuth, async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;
    const update = {};
    if (name    !== undefined) update.name    = String(name).trim();
    if (phone   !== undefined) update.phone   = String(phone).trim();
    if (address !== undefined) update.address = String(address).trim();

    const user = await User.findByIdAndUpdate(
      req.apiUser.userId,
      { $set: update },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ error: 'Utilizador não encontrado.' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /auth/me/password:
 *   patch:
 *     summary: Alterar password do utilizador autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword: { type: string }
 *               newPassword:     { type: string, minLength: 6 }
 *     responses:
 *       200:
 *         description: Password alterada
 *       400:
 *         description: Password actual incorrecta ou nova password inválida
 */
router.patch('/me/password', apiAuth, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ error: 'currentPassword e newPassword são obrigatórios.' });

    if (newPassword.length < 6)
      return res.status(400).json({ error: 'A nova password deve ter pelo menos 6 caracteres.' });

    const user = await User.findById(req.apiUser.userId);
    if (!user) return res.status(404).json({ error: 'Utilizador não encontrado.' });

    const valid = await user.comparePassword(currentPassword);
    if (!valid)
      return res.status(400).json({ error: 'A password actual está incorrecta.' });

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password alterada com sucesso.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
