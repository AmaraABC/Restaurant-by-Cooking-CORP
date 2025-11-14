import rateLimit from "express-rate-limit";

export const globalRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: "Trop de requêtes. Réessayez plus tard.",
});

export const authRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: "Trop de tentatives de connexion.",
});
