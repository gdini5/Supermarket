const Product              = require('../models/Product');
const { PRODUCT_CATEGORIES } = require('../models/Product');
const Supermarket          = require('../models/Supermarket');
 
const ProductController = {};
 
// Helper: encontra o supermercado do utilizador autenticado
async function getSupermarket(userId) {
  return Supermarket.findOne({ userId, active: true });
}
 
// ── Listar ────────────────────────────────────────────────────────────────────
ProductController.list = async (req, res) => {
  try {
    const sm = await getSupermarket(req.session.userId);
    if (!sm) return res.render('error', { message: 'Supermercado não encontrado.' });
 
    const { search, category } = req.query;
    const filter = { supermarketId: sm._id };
    if (category) filter.category = category;
    if (search)   filter.name = { $regex: search, $options: 'i' };
 
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.render('products/index', {
      products, sm,
      categories: PRODUCT_CATEGORIES,
      search:   search   || '',
      category: category || ''
    });
  } catch (err) {
    console.error(err);
    res.render('error', { message: 'Erro ao listar produtos.' });
  }
};
 
// ── Formulário criar ──────────────────────────────────────────────────────────
ProductController.showCreate = async (req, res) => {
  try {
    const sm = await getSupermarket(req.session.userId);
    if (!sm) return res.render('error', { message: 'Supermercado não encontrado.' });
    res.render('products/create', { sm, categories: PRODUCT_CATEGORIES, error: null });
  } catch (err) {
    res.render('error', { message: 'Erro ao carregar formulário.' });
  }
};
 
// ── Criar ─────────────────────────────────────────────────────────────────────
ProductController.create = async (req, res) => {
  try {
    const sm = await getSupermarket(req.session.userId);
    if (!sm) return res.render('error', { message: 'Supermercado não encontrado.' });
 
    const { name, description, category, price, stock } = req.body;
    const image = req.file ? req.file.filename : 'default-product.png';
 
    await Product.create({
      supermarketId: sm._id,
      name, description, category,
      price: parseFloat(price),
      stock: parseInt(stock),
      image
    });
    res.redirect('/products');
  } catch (err) {
    console.error(err);
    const sm = await getSupermarket(req.session.userId).catch(() => null);
    res.render('products/create', { sm, categories: PRODUCT_CATEGORIES, error: 'Erro ao criar produto.' });
  }
};
 
// ── Formulário editar ─────────────────────────────────────────────────────────
ProductController.showEdit = async (req, res) => {
  try {
    const sm      = await getSupermarket(req.session.userId);
    const product = await Product.findOne({ _id: req.params.id, supermarketId: sm._id });
    if (!product) return res.render('error', { message: 'Produto não encontrado.' });
    res.render('products/edit', { product, sm, categories: PRODUCT_CATEGORIES, error: null });
  } catch (err) {
    res.render('error', { message: 'Erro ao carregar produto.' });
  }
};
 
// ── Actualizar ────────────────────────────────────────────────────────────────
ProductController.update = async (req, res) => {
  try {
    const sm      = await getSupermarket(req.session.userId);
    const product = await Product.findOne({ _id: req.params.id, supermarketId: sm._id });
    if (!product) return res.render('error', { message: 'Produto não encontrado.' });
 
    const { name, description, category, price, stock, active } = req.body;
    product.name        = name;
    product.description = description;
    product.category    = category;
    product.price       = parseFloat(price);
    product.stock       = parseInt(stock);
    product.active      = active === 'on';
    if (req.file) product.image = req.file.filename;
 
    await product.save();
    res.redirect('/products');
  } catch (err) {
    console.error(err);
    res.render('error', { message: 'Erro ao atualizar produto.' });
  }
};
 
// ── Eliminar ──────────────────────────────────────────────────────────────────
ProductController.delete = async (req, res) => {
  try {
    const sm = await getSupermarket(req.session.userId);
    await Product.findOneAndDelete({ _id: req.params.id, supermarketId: sm._id });
    res.redirect('/products');
  } catch (err) {
    res.render('error', { message: 'Erro ao eliminar produto.' });
  }
};
 
module.exports = ProductController;