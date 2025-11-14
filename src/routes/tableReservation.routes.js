import express from "express";
import {
    createTable,
    getAllTables,
    getTableById,
    updateTable,
    deleteTable
} from "../controllers/tableReservation.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();

// Routes accessibles au personnel
router.post("/", authenticate, authorize("staff"), createTable);
router.put("/:id", authenticate, authorize("staff"), updateTable);
router.delete("/:id", authenticate, authorize("staff"), deleteTable);

// Routes publiques
router.get("/", getAllTables);
router.get("/:id", getTableById);

export default router;

/**
 * @swagger
 * tags:
 *   name: Tables
 *   description: Gestion des tables du restaurant
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Table:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         table_number:
 *           type: integer
 *           example: 5
 *         seats:
 *           type: integer
 *           example: 4
 *         emplacement:
 *           type: string
 *           example: "terrasse"
 *     TableInput:
 *       type: object
 *       required:
 *         - table_number
 *         - seats
 *       properties:
 *         table_number:
 *           type: integer
 *           example: 10
 *         seats:
 *           type: integer
 *           example: 4
 *         emplacement:
 *           type: string
 *           example: "salle"
 */

/**
 * @swagger
 * /tables:
 *   post:
 *     summary: Créer une nouvelle table
 *     tags: [Tables]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TableInput'
 *     responses:
 *       201:
 *         description: Table ajoutée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 table:
 *                   $ref: '#/components/schemas/Table'
 *       400:
 *         description: Données manquantes ou invalides
 */

/**
 * @swagger
 * /tables:
 *   get:
 *     summary: Récupérer toutes les tables
 *     tags: [Tables]
 *     responses:
 *       200:
 *         description: Liste de toutes les tables
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Table'
 */

/**
 * @swagger
 * /tables/{id}:
 *   get:
 *     summary: Récupérer une table par ID
 *     tags: [Tables]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la table
 *     responses:
 *       200:
 *         description: Table trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Table'
 *       404:
 *         description: Table introuvable
 */

/**
 * @swagger
 * /tables/{id}:
 *   put:
 *     summary: Mettre à jour une table
 *     tags: [Tables]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la table
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TableInput'
 *     responses:
 *       200:
 *         description: Table mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 table:
 *                   $ref: '#/components/schemas/Table'
 *       404:
 *         description: Table non trouvée
 */

/**
 * @swagger
 * /tables/{id}:
 *   delete:
 *     summary: Supprimer une table
 *     tags: [Tables]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Table supprimée avec succès
 *       404:
 *         description: Table non trouvée
 */