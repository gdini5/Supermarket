/**
 * routes/admin.js — Rotas do painel de administração.
 * Protegido no app.js por requireRole('admin').
 *
 * Agrupa 4 áreas:
 *   • /admin/dashboard                  — estatísticas gerais
 *   • /admin/supermarkets (+ /approve, /reject, /delete) — aprovação e gestão
 *   • /admin/users (+ /toggle, /delete) — gestão de utilizadores
 *   • /admin/categories (+ CRUD)        — categorias de produtos
 *   • /admin/orders                     — monitorização de encomendas
 */

const express         = require('express');
const router          = express.Router();
const AdminController = require('../controllers/AdminController');
 
router.get('/dashboard',                      AdminController.dashboard);
router.get('/orders',                         AdminController.listOrders);
router.get('/supermarkets',                   AdminController.listSupermarkets);
router.post('/supermarkets/:id/approve',      AdminController.approve);
router.post('/supermarkets/:id/reject',       AdminController.reject);
router.post('/supermarkets/:id/delete',       AdminController.deleteSupermarket);
router.get('/users',                          AdminController.listUsers);
router.post('/users/:id/toggle',              AdminController.toggleUser);
router.post('/users/:id/delete',              AdminController.deleteUser);
router.get('/categories',                     AdminController.listCategories);
router.post('/categories',                    AdminController.createCategory);
router.post('/categories/:id/toggle',         AdminController.toggleCategory);
router.post('/categories/:id/delete',         AdminController.deleteCategory);
 
module.exports = router;