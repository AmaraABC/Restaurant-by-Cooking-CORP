import express from "express";
import {
    register,
    login,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getMyProfile
} from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", authenticate, getMyProfile);
router.put("/:id", authenticate, updateUser);
router.delete("/:id", authenticate, deleteUser);

router.get("/", authenticate, authorize("staff"), getAllUsers);
router.get("/:id", authenticate, authorize("staff"), getUserById);

export default router;