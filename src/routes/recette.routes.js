import { Router } from "express";
import {
  getRecettes,
  getRecetteById,
  createRecette,
  updateRecette,
  deleteRecette
} from "../controllers/recette.controller.js";

const router = Router();

router.get("/", getRecettes);
router.get("/:id", getRecetteById);
router.post("/", createRecette);
router.put("/:id", updateRecette);
router.delete("/:id", deleteRecette);

export default router;
