/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ProductController.js — CRUD de produtos
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Todas as ações são contextualizadas ao supermercado do utilizador logado
 * (obtido por getSupermarket). Um supermercado só pode editar ou apagar os
 * seus próprios produtos — as queries incluem sempre `supermarketId: sm._id`
 * como segurança adicional.
 *
 *   • list       — listagem com pesquisa (nome), filtro por categoria e
 *                  filtro por estado de stock (sem stock / baixo / ok).
 *   • showCreate / create — formulário + criação (com upload multer).
 *   • showEdit / update   — formulário + atualização (mantém imagem se
 *                  não for enviada nova).
 *   • delete     — eliminação definitiva.
 *
 * O upload de imagens é tratado no router products.js via multer; o
 * controller só recebe req.file.filename.
 */

const Product = require("../models/Product");
const { PRICE_UNITS } = require("../models/Product");
const Supermarket = require("../models/Supermarket");
const Category = require("../models/Category");

const ProductController = {};

async function getSupermarket(userId) {
  return Supermarket.findOne({ userId, active: true });
}

async function getCategories() {
  return Category.find({ active: true }).sort({ name: 1 });
}

ProductController.list = async (req, res) => {
  try {
    const sm = await getSupermarket(req.session.userId);
    if (!sm)
      return res.render("error", { message: "Supermercado não encontrado." });
    const { search, category } = req.query;
    const { stockFilter } = req.query;
    const filter = { supermarketId: sm._id };
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: "i" };
    if (stockFilter === "out") filter.stock = 0;
    else if (stockFilter === "low") filter.stock = { $gt: 0, $lte: 5 };
    else if (stockFilter === "ok") filter.stock = { $gt: 5 };
    const [products, categories] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }),
      getCategories(),
    ]);
    res.render("products/index", {
      products,
      categories,
      PRICE_UNITS,
      search: search || "",
      category: category || "",
      stockFilter: stockFilter || "",
    });
  } catch (err) {
    console.error(err);
    res.render("error", { message: "Erro ao listar produtos." });
  }
};

ProductController.showCreate = async (req, res) => {
  try {
    const sm = await getSupermarket(req.session.userId);
    if (!sm)
      return res.render("error", { message: "Supermercado não encontrado." });
    const categories = await getCategories();
    res.render("products/create", { sm, categories, PRICE_UNITS, error: null });
  } catch (err) {
    res.render("error", { message: "Erro ao carregar formulário." });
  }
};

ProductController.create = async (req, res) => {
  try {
    const sm = await getSupermarket(req.session.userId);
    if (!sm)
      return res.render("error", { message: "Supermercado não encontrado." });
    const { name, description, category, price, priceUnit, stock } = req.body;
    const image = req.file ? req.file.filename : "default-product.png";
    await Product.create({
      supermarketId: sm._id,
      name,
      description,
      category,
      price: parseFloat(price),
      priceUnit: priceUnit || "un.",
      stock: parseInt(stock),
      image,
    });
    res.redirect("/products");
  } catch (err) {
    console.error(err);
    const [sm, categories] = await Promise.all([
      getSupermarket(req.session.userId).catch(() => null),
      getCategories().catch(() => []),
    ]);
    res.render("products/create", {
      sm,
      categories,
      PRICE_UNITS,
      error: "Erro ao criar produto.",
    });
  }
};

ProductController.showEdit = async (req, res) => {
  try {
    const sm = await getSupermarket(req.session.userId);
    const product = await Product.findOne({
      _id: req.params.id,
      supermarketId: sm._id,
    });
    if (!product)
      return res.render("error", { message: "Produto não encontrado." });
    const categories = await getCategories();
    res.render("products/edit", {
      product,
      sm,
      categories,
      PRICE_UNITS,
      error: null,
    });
  } catch (err) {
    res.render("error", { message: "Erro ao carregar produto." });
  }
};

ProductController.update = async (req, res) => {
  try {
    const sm = await getSupermarket(req.session.userId);
    const product = await Product.findOne({
      _id: req.params.id,
      supermarketId: sm._id,
    });
    if (!product)
      return res.render("error", { message: "Produto não encontrado." });
    const { name, description, category, price, priceUnit, stock, active } =
      req.body;
    product.name = name;
    product.description = description;
    product.category = category;
    product.price = parseFloat(price);
    product.priceUnit = priceUnit || "un.";
    product.stock = parseInt(stock);
    product.active = active === "on";
    if (req.file) product.image = req.file.filename;
    await product.save();
    res.redirect("/products");
  } catch (err) {
    console.error(err);
    res.render("error", { message: "Erro ao atualizar produto." });
  }
};

ProductController.delete = async (req, res) => {
  try {
    const sm = await getSupermarket(req.session.userId);
    await Product.findOneAndDelete({
      _id: req.params.id,
      supermarketId: sm._id,
    });
    res.redirect("/products");
  } catch (err) {
    res.render("error", { message: "Erro ao eliminar produto." });
  }
};

module.exports = ProductController;
