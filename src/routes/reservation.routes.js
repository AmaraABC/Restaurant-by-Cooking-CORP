import express from "express";
import {
    getAllCommandes,
    getCommandeById,
    createCommande,
    updateCommande,
    deleteCommande
} from "../controllers/commande.controller.js";

const router = express.Router();

router.get("/", getAllCommandes);
router.get("/:id", getCommandeById);
router.post("/", createCommande);
router.put("/:id", updateCommande);
router.delete("/:id", deleteCommande);

export default router;
