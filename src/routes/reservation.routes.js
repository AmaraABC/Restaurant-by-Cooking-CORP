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