import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const auth = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Non autorisé" });
    }

    const token = header.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = { id: decoded.sub, role: decoded.role };
        next();
    } catch (err) {
        res.status(401).json({ message: "Token invalide ou expiré" });
    }
};

export const requireRole = (role) => (req, res, next) => {
    if (req.user.role !== role) {
        return res.status(403).json({ message: "Accès refusé" });
    }
    next();
};