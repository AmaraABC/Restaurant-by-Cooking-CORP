import jwt from "jsonwebtoken";
import Users from "../models/Users.js";

const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "60m" }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" }
    );
};

export const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        const existing = await Users.findByEmail(email);
        if (existing) return res.status(400).json({ message: "Email déjà utilisé" });

        const user = await Users.create({ username, email, password, role });
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.status(201).json({
            message: "Utilisateur créé avec succès",
            user: { id: user.id, username: user.username, role: user.role },
            accessToken,
            refreshToken
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findByEmail(email);
        if (!user) return res.status(401).json({ message: "Utilisateur introuvable" });

        const valid = await user.verifyPassword(password);
        if (!valid) return res.status(401).json({ message: "Mot de passe incorrect" });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.json({
            message: "Connexion réussie",
            user: { id: user.id, username: user.username, role: user.role },
            accessToken,
            refreshToken
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const refreshToken = (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(401).json({ message: "Token manquant" });

    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Refresh token invalide" });

        const accessToken = jwt.sign(
            { id: decoded.id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
        );
        res.json({ accessToken });
    });
};
