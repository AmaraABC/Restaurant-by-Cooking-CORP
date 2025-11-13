import express from "express";
import {
    register,
    login,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} from "../controllers/user.controller.js";

import { auth, requireRole } from "../middlewares/auth.js";

const userRoute = express.Router();

userRoute.post("/auth/register", register);
userRoute.post("/auth/login", login);

userRoute.use(auth);

userRoute.get("/", getAllUsers);
userRoute.get("/:id", getUserById);
userRoute.put("/:id", updateUser);
userRoute.delete("/:id", deleteUser);

userRoute.use("/admin", requireRole("admin"));

export default userRoute;