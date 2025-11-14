import request from "supertest";
import app from "../server.js";
import Users from "../src/models/Users.js";
import jwt from "jsonwebtoken";

// Mock du modèle PostgreSQL Users
jest.mock("../src/models/Users.js");

describe("AUTH CONTROLLER - Tests Intégration", () => {
    let mockUser;

    beforeEach(() => {
        jest.clearAllMocks();

        mockUser = {
            id: 1,
            username: "john",
            email: "john@example.com",
            role: "client",
            verifyPassword: jest.fn(),
        };
    });

    test("POST /auth/register → réussite", async () => {
        Users.findByEmail.mockResolvedValue(null); // email pas pris
        Users.create.mockResolvedValue(mockUser);

        const res = await request(app)
            .post("/auth/register")
            .send({
                username: "john",
                email: "john@example.com",
                password: "123456",
                role: "client"
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("accessToken");
        expect(res.body.user.email).toBe("john@example.com");
    });

    test("POST /auth/register → email déjà utilisé", async () => {
        Users.findByEmail.mockResolvedValue(mockUser);

        const res = await request(app)
            .post("/auth/register")
            .send({
                username: "john",
                email: "john@example.com",
                password: "123456",
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Email déjà utilisé");
    });

    test("POST /auth/login → succès", async () => {
        mockUser.verifyPassword.mockResolvedValue(true);
        Users.findByEmail.mockResolvedValue(mockUser);

        const res = await request(app)
            .post("/auth/login")
            .send({
                email: "john@example.com",
                password: "123456"
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("accessToken");
        expect(res.body.user.email).toBe("john@example.com");
    });

    test("POST /auth/login → mauvais mot de passe", async () => {
        mockUser.verifyPassword.mockResolvedValue(false);
        Users.findByEmail.mockResolvedValue(mockUser);

        const res = await request(app)
            .post("/auth/login")
            .send({
                email: "john@example.com",
                password: "wrong"
            });

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe("Mot de passe incorrect");
    });

    test("POST /auth/login → utilisateur introuvable", async () => {
        Users.findByEmail.mockResolvedValue(null);

        const res = await request(app)
            .post("/auth/login")
            .send({
                email: "unknown@example.com",
                password: "123456"
            });

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe("Utilisateur introuvable");
    });

    test("POST /auth/refresh-token → succès", async () => {
        const refreshToken = jwt.sign(
            { id: 1 },
            process.env.JWT_REFRESH_SECRET
        );

        const res = await request(app)
            .post("/auth/refresh-token")
            .send({ token: refreshToken });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("accessToken");
    });

    test("POST /auth/refresh-token → token manquant", async () => {
        const res = await request(app)
            .post("/auth/refresh-token")
            .send({});

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe("Token manquant");
    });

    test("POST /auth/refresh-token → token invalide", async () => {
        const res = await request(app)
            .post("/auth/refresh-token")
            .send({ token: "invalidToken123" });

        expect(res.statusCode).toBe(403);
        expect(res.body.message).toBe("Refresh token invalide");
    });

});