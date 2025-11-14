import Users from "../models/Users.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Tous les champs sont requis." });
        }

        const existing = await Users.findByEmail(email);
        if (existing) {
            return res.status(400).json({ message: "Email déjà utilisé." });
        }

        const newUser = await Users.create({ username, email, password, role });

        res.status(201).json({
            message: "Utilisateur créé avec succès.",
            user: newUser.toJSON()
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findByEmail(email);
        if (!user) {
            return res.status(400).json({ message: "Email ou mot de passe incorrect." });
        }

        const valid = await user.verifyPassword(password);
        if (!valid) {
            return res.status(400).json({ message: "Email ou mot de passe incorrect." });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.json({
            message: "Connexion réussie.",
            token,
            user: user.toJSON()
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await Users.findAll();

        res.status(200).json(users.map(u => u.toJSON()));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await Users.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });

        res.status(200).json(user.toJSON());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const requesterId = req.user.id;
        const requesterRole = req.user.role;

        const updated = await Users.update(id, updates, requesterRole, requesterId);

        res.status(200).json({
            message: "Utilisateur mis à jour avec succès.",
            user: updated.toJSON()
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const requesterId = req.user.id;
        const requesterRole = req.user.role;

        const deleted = await Users.delete(id, requesterRole, requesterId);
        if (!deleted) return res.status(404).json({ message: "Utilisateur introuvable." });

        res.status(200).json({ message: "Utilisateur supprimé avec succès." });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getMyProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
