import { Router } from "express";
import {
  getRecettes,
  getRecetteById,
  createRecette,
  updateRecette,
  deleteRecette
} from "../controllers/recette.controller.js";
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = Router();

router.get("/", getRecettes);
router.get("/:id", getRecetteById);

router.post("/", authenticate, authorize("staff"), createRecette);
router.put("/:id", authenticate, authorize("staff"), updateRecette);
router.delete("/:id", authenticate, authorize("staff"), deleteRecette);

export default router;

/**
 * @swagger
 * tags:
 *   name: Recipes
 *   description: Gestion des recettes du restaurant
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Recipe:
 *       type: object
 *       required:
 *         - nom
 *         - description
 *         - ingredients
 *         - etapes
 *         - temps_preparation
 *         - temps_cuisson
 *         - categorie
 *       properties:
 *         _id:
 *           type: string
 *         nom:
 *           type: string
 *         description:
 *           type: string
 *         ingredients:
 *           type: array
 *           items:
 *             type: string
 *         etapes:
 *           type: array
 *           items:
 *             type: string
 *         temps_preparation:
 *           type: number
 *         temps_cuisson:
 *           type: number
 *         difficulte:
 *           type: string
 *           enum: [facile, moyen, difficile]
 *         categorie:
 *           type: string
 *         image:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /recipes:
 *   get:
 *     summary: Récupérer toutes les recettes
 *     tags: [Recipes]
 *     responses:
 *       200:
 *         description: Liste des recettes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 *   post:
 *     summary: Créer une nouvelle recette
 *     tags: [Recipes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recipe'
 *     responses:
 *       201:
 *         description: Recette créée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 */

/**
 * @swagger
 * /recipes/{id}:
 *   get:
 *     summary: Récupérer une recette par ID
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la recette
 *     responses:
 *       200:
 *         description: Recette trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *   put:
 *     summary: Mettre à jour une recette
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la recette
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recipe'
 *     responses:
 *       200:
 *         description: Recette mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *   delete:
 *     summary: Supprimer une recette
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la recette
 *     responses:
 *       200:
 *         description: Recette supprimée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
