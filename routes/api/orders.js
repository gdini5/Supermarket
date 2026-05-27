const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../../models/Order");
const { ORDER_STATUS } = require("../../models/Order");
const Product = require("../../models/Product");
const Supermarket = require("../../models/Supermarket");
const { BUSINESS_RULES } = require("../../config/constants");
const { apiAuth, requireApiRole } = require("../../middleware/apiAuth");

/**
 * @swagger
 * tags:
 *   name: Encomendas
 *   description: Gestão de encomendas
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Listar encomendas (filtradas pelo role do utilizador)
 *     tags: [Encomendas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [pending, confirmed, preparing, delivering, delivered, cancelled] }
 *     responses:
 *       200:
 *         description: Lista de encomendas
 *       401:
 *         description: Não autenticado
 */
router.get("/", apiAuth, async (req, res, next) => {
  try {
    const { role, userId } = req.apiUser;
    const statusFilter = req.query.status;
    let filter = {};

    if (role === "client") {
      filter.clientId = userId;
    } else if (role === "supermarket") {
      const sm = await Supermarket.findOne({ userId });
      if (!sm) return res.json([]);
      filter.supermarketId = sm._id;
    } else if (role === "courier") {
      filter = {
        $or: [
          { courierId: userId },
          {
            status: ORDER_STATUS.PREPARING,
            deliveryMethod: "courier",
            courierId: null,
          },
        ],
      };
    }
    // admin vê tudo — filter permanece {}

    if (statusFilter && role !== "courier") filter.status = statusFilter;

    const orders = await Order.find(filter)
      .populate("clientId", "name email")
      .populate("supermarketId", "name")
      .populate("courierId", "name phone")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Criar encomenda (checkout)
 *     tags: [Encomendas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [deliveryMethod]
 *             properties:
 *               deliveryMethod: { type: string, enum: [pickup, courier] }
 *     responses:
 *       201:
 *         description: Encomenda criada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Carrinho vazio, método de entrega inválido, ou stock insuficiente
 *       403:
 *         description: Sem permissão (só clientes)
 */
router.post("/", apiAuth, requireApiRole("client"), async (req, res, next) => {
  try {
    const cart = req.session.cart;
    if (!cart || !cart.items || cart.items.length === 0)
      return res
        .status(400)
        .json({ error: "O carrinho está vazio.", code: "EMPTY_CART" });

    const { deliveryMethod } = req.body;
    if (!deliveryMethod)
      return res
        .status(400)
        .json({ error: "O método de entrega é obrigatório." });

    const sm = await Supermarket.findOne({
      _id: cart.supermarketId,
      approved: true,
      active: true,
    });
    if (!sm)
      return res
        .status(400)
        .json({ error: "Supermercado não encontrado ou não aprovado." });

    // Validar método de entrega suportado pelo supermercado
    const validMethod = sm.deliveryMethods.find(
      (d) => d.type === deliveryMethod,
    );
    if (!validMethod)
      return res
        .status(400)
        .json({
          error: "Método de entrega não suportado por este supermercado.",
        });

    // Decremento atómico de stock com rollback se falhar
    const orderItems = [];
    for (const item of cart.items) {
      const updated = await Product.findOneAndUpdate(
        { _id: item.productId, stock: { $gte: item.quantity }, active: true },
        { $inc: { stock: -item.quantity } },
        { new: true },
      );
      if (!updated) {
        // Rollback dos itens já decrementados
        for (const done of orderItems)
          await Product.findByIdAndUpdate(done.productId, {
            $inc: { stock: done.quantity },
          });

        // Buscar o stock atual para informar o cliente quanto está disponível
        const current = await Product.findById(item.productId).select(
          "stock name",
        );
        const available = current ? current.stock : 0;
        return res.status(400).json({
          error: `Stock insuficiente para "${item.name}". Disponível: ${available} ${available === 1 ? "unidade" : "unidades"}.`,
          code: "INSUFFICIENT_STOCK",
          productId: item.productId,
          available,
        });
      }
      orderItems.push({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      });
    }

    const deliveryCost = validMethod.cost || 0;
    const total =
      orderItems.reduce((acc, i) => acc + i.price * i.quantity, 0) +
      deliveryCost;

    const order = await Order.create({
      clientId: req.apiUser.userId,
      supermarketId: sm._id,
      items: orderItems,
      total,
      deliveryMethod,
      deliveryCost,
      status: ORDER_STATUS.PENDING,
      confirmedAt: new Date(),
    });

    req.session.cart = { items: [], supermarketId: null };

    const populated = await Order.findById(order._id)
      .populate("clientId", "name email")
      .populate("supermarketId", "name address");

    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Detalhe de uma encomenda
 *     tags: [Encomendas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Encomenda encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: ID inválido
 *       403:
 *         description: Sem acesso a esta encomenda (IDOR protection)
 *       404:
 *         description: Encomenda não encontrada
 */
/**
 * @swagger
 * /orders/stats:
 *   get:
 *     summary: Estatísticas do cliente (nº de encomendas, total gasto, produto mais comprado)
 *     tags: [Encomendas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas do cliente autenticado
 */
router.get("/stats", apiAuth, requireApiRole("client"), async (req, res, next) => {
  try {
    const { userId } = req.apiUser;
    const clientId = new mongoose.Types.ObjectId(userId);

    const [counts, topProductAgg] = await Promise.all([
      // Total de encomendas e total gasto (exclui canceladas do total gasto)
      Order.aggregate([
        { $match: { clientId } },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalSpent: {
              $sum: {
                $cond: [{ $ne: ["$status", ORDER_STATUS.CANCELLED] }, "$total", 0],
              },
            },
          },
        },
      ]),
      // Produto mais comprado (soma de quantidades por nome)
      Order.aggregate([
        { $match: { clientId } },
        { $unwind: "$items" },
        { $group: { _id: "$items.name", qty: { $sum: "$items.quantity" } } },
        { $sort: { qty: -1 } },
        { $limit: 1 },
      ]),
    ]);

    const stats = counts[0] || { totalOrders: 0, totalSpent: 0 };
    res.json({
      totalOrders: stats.totalOrders,
      totalSpent: stats.totalSpent,
      topProduct: topProductAgg[0]
        ? { name: topProductAgg[0]._id, quantity: topProductAgg[0].qty }
        : null,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", apiAuth, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ error: "ID de encomenda inválido." });

    const order = await Order.findById(req.params.id)
      .populate("clientId", "name email")
      .populate("supermarketId", "name address userId")
      .populate("courierId", "name phone");

    if (!order)
      return res.status(404).json({ error: "Encomenda não encontrada." });

    // IDOR: verificar que o utilizador tem acesso
    const { role, userId } = req.apiUser;
    let hasAccess =
      role === "admin" || order.clientId?._id.toString() === userId.toString();

    if (!hasAccess && role === "supermarket") {
      const sm = await Supermarket.findOne({ userId });
      hasAccess = sm?._id.toString() === order.supermarketId?._id?.toString();
    }

    if (!hasAccess && role === "courier") {
      hasAccess =
        order.courierId?._id?.toString() === userId.toString() ||
        (order.status === ORDER_STATUS.PREPARING &&
          order.deliveryMethod === "courier" &&
          !order.courierId);
    }

    if (!hasAccess)
      return res.status(403).json({ error: "Acesso negado a esta encomenda." });

    res.json(order);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Atualizar estado de uma encomenda
 *     tags: [Encomendas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [confirmed, preparing, delivering, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Estado atualizado
 *       400:
 *         description: Transição inválida, prazo de cancelamento expirado, ou ID inválido
 *       403:
 *         description: Role sem permissão para este estado
 *       404:
 *         description: Encomenda não encontrada
 *       409:
 *         description: Courier já tem entrega ativa
 */
router.patch("/:id/status", apiAuth, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ error: "ID de encomenda inválido." });

    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ error: "Encomenda não encontrada." });

    const { status } = req.body;
    const { role, userId } = req.apiUser;

    if (!status)
      return res.status(400).json({ error: "O campo status é obrigatório." });

    // Validar transições permitidas por role
    const allowed = {
      admin: Object.values(ORDER_STATUS),
      supermarket: [
        ORDER_STATUS.CONFIRMED,
        ORDER_STATUS.PREPARING,
        ORDER_STATUS.CANCELLED,
      ],
      courier: [ORDER_STATUS.DELIVERING, ORDER_STATUS.DELIVERED],
      client: [ORDER_STATUS.CANCELLED],
    };

    if (!allowed[role]?.includes(status))
      return res
        .status(403)
        .json({
          error: "Transição de estado não permitida para o seu perfil.",
        });

    // Janela de cancelamento de 5 minutos para o cliente
    if (status === ORDER_STATUS.CANCELLED && role === "client") {
      const elapsed = Date.now() - new Date(order.confirmedAt).getTime();
      if (elapsed > BUSINESS_RULES.CANCEL_WINDOW_MS)
        return res.status(400).json({
          error: "O prazo de 5 minutos para cancelar já passou.",
          code: "CANCEL_WINDOW_EXPIRED",
        });
    }

    // Verificar que o supermercado só altera as suas encomendas
    if (role === "supermarket") {
      const sm = await Supermarket.findOne({ userId });
      if (!sm || sm._id.toString() !== order.supermarketId.toString())
        return res
          .status(403)
          .json({ error: "Esta encomenda não pertence ao seu supermercado." });
    }

    // Courier não pode ter mais do que uma entrega ativa
    if (status === ORDER_STATUS.DELIVERING && role === "courier") {
      const active = await Order.findOne({
        courierId: userId,
        status: ORDER_STATUS.DELIVERING,
      });
      if (active)
        return res.status(409).json({
          error: "Já tens uma entrega em curso. Termina-a primeiro.",
          code: "ACTIVE_DELIVERY_EXISTS",
        });
    }

    // Repor stock quando uma encomenda é cancelada (se ainda não estava cancelada).
    // Sem isto, os produtos ficavam "presos" fora do stock após um cancelamento.
    if (
      status === ORDER_STATUS.CANCELLED &&
      order.status !== ORDER_STATUS.CANCELLED
    ) {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: item.quantity },
        });
      }
    }

    order.status = status;
    if (status === ORDER_STATUS.CONFIRMED) order.confirmedAt = new Date();
    if (status === ORDER_STATUS.DELIVERING) order.courierId = userId;
    await order.save();

    const updated = await Order.findById(order._id)
      .populate("clientId", "name email")
      .populate("supermarketId", "name")
      .populate("courierId", "name phone");

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
