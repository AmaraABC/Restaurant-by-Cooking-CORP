import express from "express";
import {
  createReservation,
  getAllReservations,
  getReservationById,
  updateReservation,
  deleteReservation,
  getMyReservations
} from "../controllers/reservation.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();

// --- Routes client + staff ---
router.post("/", authenticate, createReservation);
router.delete("/:id", authenticate, deleteReservation);
router.get("/my", authenticate, getMyReservations);
router.put("/:id", authenticate, updateReservation);

// --- Routes du staff ---
router.get("/", authenticate, authorize("staff"), getAllReservations);
router.get("/:id", authenticate, authorize("staff"), getReservationById);

export default router;

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Gestion des réservations de tables
 */

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Crée une nouvelle réservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - table_id
 *               - reservation_time
 *               - reservation_date
 *               - guests
 *             properties:
 *               table_id:
 *                 type: integer
 *               reservation_time:
 *                 type: string
 *                 format: time
 *               reservation_date:
 *                 type: string
 *                 format: date
 *               guests:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Réservation créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Tous les champs sont requis
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Récupère toutes les réservations (staff uniquement)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste de toutes les réservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       403:
 *         description: Accès refusé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /reservations/my:
 *   get:
 *     summary: Récupère les réservations du user connecté
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des réservations de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /reservations/{id}:
 *   get:
 *     summary: Récupère une réservation par son ID
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la réservation
 *     responses:
 *       200:
 *         description: Détails de la réservation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: Réservation non trouvée
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /reservations/{id}:
 *   put:
 *     summary: Met à jour une réservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la réservation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               table_id:
 *                 type: integer
 *               reservation_time:
 *                 type: string
 *                 format: time
 *               reservation_date:
 *                 type: string
 *                 format: date
 *               guests:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Réservation mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Table déjà réservée pour ce créneau
 *       403:
 *         description: Action non autorisée
 *       404:
 *         description: Réservation introuvable
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /reservations/{id}:
 *   delete:
 *     summary: Supprime une réservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la réservation
 *     responses:
 *       200:
 *         description: Réservation supprimée avec succès
 *       403:
 *         description: Action non autorisée
 *       404:
 *         description: Réservation introuvable
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         users_id:
 *           type: integer
 *         table_id:
 *           type: integer
 *         reservation_time:
 *           type: string
 *           format: time
 *         reservation_date:
 *           type: string
 *           format: date
 *         guests:
 *           type: integer
 */