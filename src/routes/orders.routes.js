import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getMyOrders
} from "../controllers/orders.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();

// Routes accessibles aux clients + staff
router.post("/", authenticate, createOrder);
router.delete("/:id", authenticate, deleteOrder);
router.get("/my", authenticate, getMyOrders);
router.put("/:id", authenticate, updateOrder);

// Routes accessibles uniquement au staff
router.get("/", authenticate, authorize("staff"), getAllOrders);
router.get("/:id", authenticate, authorize("staff"), getOrderById);

export default router;