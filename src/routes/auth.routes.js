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