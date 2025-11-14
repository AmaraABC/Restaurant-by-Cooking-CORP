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

// Routes accessibles au personnel (staff uniquement)
router.post("/", authenticate, authorize("staff"), createTable);
router.put("/:id", authenticate, authorize("staff"), updateTable);
router.delete("/:id", authenticate, authorize("staff"), deleteTable);

// Routes publiques (ex: consultation des tables disponibles)
router.get("/", getAllTables);
router.get("/:id", getTableById);

export default router;