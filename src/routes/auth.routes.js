import express from "express";
import { register, login, refreshToken } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();

// Routes publiques
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);

// Routes protégées
router.get("/profile", authenticate, (req, res) => {
    res.json({ message: "Profil utilisateur", user: req.user });
});

router.get("/staff", authenticate, authorize("staff"), (req, res) => {
    res.json({ message: "Bienvenue sur la page du personnel du restaurant !" });
});

export default router;

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Gestion de l'authentification
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           example: john
 *         email:
 *           type: string
 *           example: john@example.com
 *         password:
 *           type: string
 *           example: 123456
 *         role:
 *           type: string
 *           enum: [client, staff]
 *           example: client
 *
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: john@example.com
 *         password:
 *           type: string
 *           example: 123456
 *
 *     RefreshTokenRequest:
 *       type: object
 *       required:
 *         - token
 *       properties:
 *         token:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsIn...
 *
 *     AuthUser:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         username:
 *           type: string
 *           example: john
 *         role:
 *           type: string
 *           example: client
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Connexion réussie
 *         user:
 *           $ref: '#/components/schemas/AuthUser'
 *         accessToken:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR...
 *         refreshToken:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR...
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Enregistrer un nouvel utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Email déjà utilisé
 *         content:
 *           application/json:
 *             example:
 *               message: Email déjà utilisé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Identifiants invalides
 *         content:
 *           application/json:
 *             examples:
 *               emailNotFound:
 *                 summary: Email inconnu
 *                 value:
 *                   message: Utilisateur introuvable
 *               wrongPassword:
 *                 summary: Mauvais mot de passe
 *                 value:
 *                   message: Mot de passe incorrect
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Générer un nouvel access token à partir d'un refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenRequest'
 *     responses:
 *       200:
 *         description: Nouveau token généré
 *         content:
 *           application/json:
 *             example:
 *               accessToken: eyJhbGciOiJIUzI1NiIsInR5...
 *       401:
 *         description: Token manquant
 *         content:
 *           application/json:
 *             example:
 *               message: Token manquant
 *       403:
 *         description: Refresh token invalide
 *         content:
 *           application/json:
 *             example:
 *               message: Refresh token invalide
 *       500:
 *         description: Erreur serveur
 */