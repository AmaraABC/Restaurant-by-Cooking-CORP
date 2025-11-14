import { Router } from 'express';
import {
    getPlats,
    getPlatById,
    createPlat,
    updatePlat,
    deletePlat
} from '../controllers/plat.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = Router();

router.get('/', getPlats);
router.get('/:id', getPlatById);

router.post("/", authenticate, authorize("staff"), createPlat);
router.put("/:id", authenticate, authorize("staff"), updatePlat);
router.delete("/:id", authenticate, authorize("staff"), deletePlat);

export default router;

/**
 * @swagger
 * tags:
 *   name: Meals
 *   description: Gestion des menus du restaurant
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Meal:
 *       type: object
 *       required:
 *         - nom
 *         - prix
 *         - categorie
 *         - recette_id
 *       properties:
 *         _id:
 *           type: string
 *         nom:
 *           type: string
 *         prix:
 *           type: number
 *         categorie:
 *           type: string
 *         recette_id:
 *           type: string
 *           description: ID de la recette associée
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /meals:
 *   get:
 *     summary: Récupérer tous les plats
 *     tags: [Meals]
 *     responses:
 *       200:
 *         description: Liste des plats
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Meal'
 *   post:
 *     summary: Créer un nouveau plat
 *     tags: [Meals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Meal'
 *     responses:
 *       201:
 *         description: Plat créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meal'
 */

/**
 * @swagger
 * /meals/{id}:
 *   get:
 *     summary: Récupérer un plat par ID
 *     tags: [Meals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du plat
 *     responses:
 *       200:
 *         description: Plat trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meal'
 *   put:
 *     summary: Mettre à jour un plat
 *     tags: [Meals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du plat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Meal'
 *     responses:
 *       200:
 *         description: Plat mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meal'
 *   delete:
 *     summary: Supprimer un plat
 *     tags: [Meals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du plat
 *     responses:
 *       200:
 *         description: Plat supprimé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */