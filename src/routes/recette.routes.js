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
