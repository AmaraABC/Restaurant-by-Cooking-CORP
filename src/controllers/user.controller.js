import { User } from "../models/user.model.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (await User.findOne({ email })) {
            return res.status(400).json({ message: "Email déjà utilisé" });
        }

        const user = new User({ email, password, role });
        await user.save();

        res.status(201).json({ message: "Utilisateur créé", user: { id: user._id, email, role } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");
        if (!user) return res.status(400).json({ message: "Email ou mot de passe invalide" });

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.status(400).json({ message: "Email ou mot de passe invalide" });

        const token = jwt.sign({ sub: user._id, role: user.role }, JWT_SECRET, { expiresIn: "2h" });

        res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getAllUsers = async (req, res) => {
    const users = await User.find().select("-password");
    res.json(users);
};

export const getUserById = async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json(user);
};

export const updateUser = async (req, res) => {
    const { email, password, role } = req.body;
    const updateData = { email, role };
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json({ message: "Utilisateur mis à jour", user });
};

export const deleteUser = async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json({ message: "Utilisateur supprimé", user });
};