import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getMyOrders
} from "../controllers/orders.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();

// Routes accessibles aux clients + staff
router.post("/", authenticate, createOrder);
router.delete("/:id", authenticate, deleteOrder);
router.get("/my", authenticate, getMyOrders);
router.put("/:id", authenticate, updateOrder);

// Routes accessibles uniquement au staff
router.get("/", authenticate, authorize("staff"), getAllOrders);
router.get("/:id", authenticate, authorize("staff"), getOrderById);

export default router;

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Gestion des commandes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         users_id:
 *           type: integer
 *         order_status:
 *           type: string
 *           example: "en attente"
 *         price:
 *           type: number
 *           format: float
 *           example: 19.99
 *         created_at:
 *           type: string
 *           format: date-time
 *     CreateOrderInput:
 *       type: object
 *       required:
 *         - price
 *       properties:
 *         price:
 *           type: number
 *           example: 24.90
 *         order_status:
 *           type: string
 *           example: "en attente"
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Créer une commande
 *     description: Accessible uniquement aux utilisateurs authentifiés.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderInput'
 *     responses:
 *       201:
 *         description: Commande créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Récupérer toutes les commandes
 *     description: Accessible uniquement au personnel (**staff**).
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des commandes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       403:
 *         description: Accès refusé (réservé au staff)
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /orders/my:
 *   get:
 *     summary: Récupérer les commandes de l'utilisateur connecté
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des commandes de l'utilisateur connecté
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Récupérer une commande par ID
 *     description: Accessible par le **staff** ou le **propriétaire** de la commande.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la commande
 *     responses:
 *       200:
 *         description: Commande trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       403:
 *         description: Action non autorisée
 *       404:
 *         description: Commande non trouvée
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Mettre à jour une commande
 *     description: Accessible par le **propriétaire** ou le **staff**.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la commande à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               price:
 *                 type: number
 *               order_status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Commande mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       403:
 *         description: Action non autorisée
 *       404:
 *         description: Commande introuvable
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Supprimer une commande
 *     description: Accessible par le **propriétaire** ou le **staff**.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la commande à supprimer
 *     responses:
 *       200:
 *         description: Commande supprimée avec succès
 *       403:
 *         description: Action non autorisée
 *       404:
 *         description: Commande non trouvée
 *       500:
 *         description: Erreur serveur
 */