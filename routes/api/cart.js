const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../../models/Product");
const { apiAuth, requireApiRole } = require("../../middleware/apiAuth");

/**
 * @swagger
 * tags:
 *   name: Carrinho
 *   description: Gestão do carrinho de compras (partilhado com o backoffice via sessão)
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Ver carrinho atual
 *     tags: [Carrinho]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carrinho atual
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:          { type: array }
 *                 supermarketId:  { type: string, nullable: true }
 *       401:
 *         description: Não autenticado
 */
router.get("/", apiAuth, (req, res) => {
  const cart = req.session.cart || { items: [], supermarketId: null };
  res.json(cart);
});

/**
 * @swagger
 * /cart/add/{productId}:
 *   post:
 *     summary: Adicionar produto ao carrinho
 *     tags: [Carrinho]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity: { type: integer, default: 1, minimum: 1 }
 *     responses:
 *       200:
 *         description: Carrinho atualizado
 *       400:
 *         description: Produto sem stock, supermercado diferente, ou ID inválido
 *       403:
 *         description: Sem permissão (só clientes)
 *       404:
 *         description: Produto não encontrado
 */
router.post(
  "/add/:productId",
  apiAuth,
  requireApiRole("client"),
  async (req, res, next) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.productId))
        return res.status(400).json({ error: "ID de produto inválido." });

      const quantity = Math.max(1, parseInt(req.body.quantity) || 1);

      const product = await Product.findById(req.params.productId).populate({
        path: "supermarketId",
        match: { approved: true, active: true },
      });

      if (
        !product ||
        !product.active ||
        product.stock < 1 ||
        !product.supermarketId
      )
        return res
          .status(400)
          .json({ error: "Produto indisponível ou sem stock." });

      if (!req.session.cart)
        req.session.cart = { items: [], supermarketId: null };
      const cart = req.session.cart;

      // Garantir que todos os produtos são do mesmo supermercado (regra 8a)
      const smId = product.supermarketId._id.toString();
      if (cart.supermarketId && cart.supermarketId.toString() !== smId)
        return res.status(400).json({
          error:
            "Não é possível misturar produtos de supermercados diferentes.",
          code: "DIFFERENT_SUPERMARKET",
        });

      cart.supermarketId = smId;

      const existing = cart.items.find(
        (i) => i.productId === product._id.toString(),
      );
      if (existing) {
        // Quantidade total que o cliente quer ter no carrinho
        const desired = existing.quantity + quantity;
        if (desired > product.stock) {
          return res.status(400).json({
            error: `Stock insuficiente para "${product.name}". Disponível: ${product.stock} ${product.stock === 1 ? "unidade" : "unidades"} (já tens ${existing.quantity} no carrinho).`,
            code: "INSUFFICIENT_STOCK",
            available: product.stock,
          });
        }
        existing.quantity = desired;
      } else {
        if (quantity > product.stock)
          return res.status(400).json({
            error: `Stock insuficiente para "${product.name}". Disponível: ${product.stock} ${product.stock === 1 ? "unidade" : "unidades"}.`,
            code: "INSUFFICIENT_STOCK",
            available: product.stock,
          });
        cart.items.push({
          productId: product._id.toString(),
          name: product.name,
          price: product.price,
          priceUnit: product.priceUnit || "un.",
          image: product.image,
          quantity,
        });
      }

      res.json(cart);
    } catch (err) {
      next(err);
    }
  },
);

/**
 * @swagger
 * /cart/update:
 *   put:
 *     summary: Alterar quantidade de um item no carrinho
 *     tags: [Carrinho]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, quantity]
 *             properties:
 *               productId: { type: string }
 *               quantity:  { type: integer, minimum: 0, description: "0 remove o item" }
 *     responses:
 *       200:
 *         description: Carrinho atualizado
 *       400:
 *         description: Dados inválidos
 */
router.put("/update", apiAuth, requireApiRole("client"), async (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId)
    return res.status(400).json({ error: "productId é obrigatório." });

  if (!req.session.cart) return res.json({ items: [], supermarketId: null });

  const cart = req.session.cart;
  const qty = parseInt(quantity);

  if (isNaN(qty) || qty < 0)
    return res.status(400).json({ error: "Quantidade inválida." });

  if (qty === 0) {
    cart.items = cart.items.filter((i) => i.productId !== productId);
    if (cart.items.length === 0) cart.supermarketId = null;
  } else {
    const item = cart.items.find((i) => i.productId === productId);
    if (!item)
      return res
        .status(404)
        .json({ error: "Item não encontrado no carrinho." });

    // Validar stock disponível antes de aumentar
    const product = await Product.findById(productId).select("stock name");
    if (!product)
      return res.status(404).json({ error: "Produto não encontrado." });
    if (qty > product.stock)
      return res.status(400).json({
        error: `Stock insuficiente para "${product.name}". Disponível: ${product.stock} ${product.stock === 1 ? "unidade" : "unidades"}.`,
        code: "INSUFFICIENT_STOCK",
        available: product.stock,
      });

    item.quantity = qty;
  }

  res.json(cart);
});

/**
 * @swagger
 * /cart/clear:
 *   delete:
 *     summary: Limpar o carrinho
 *     tags: [Carrinho]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carrinho limpo
 */
router.delete("/clear", apiAuth, requireApiRole("client"), (req, res) => {
  req.session.cart = { items: [], supermarketId: null };
  res.json({ items: [], supermarketId: null });
});

module.exports = router;
