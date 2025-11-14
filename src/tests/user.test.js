import request from "supertest";
import app from "../server.js";
import Users from "../models/Users.js";
import jwt from "jsonwebtoken";

jest.mock("../models/Users.js");

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

describe("User Controller - Tests d'intégration", () => {
    describe("POST /users/register", () => {

        it("devrait créer un utilisateur", async () => {
            Users.findByEmail.mockResolvedValue(null);

            Users.create.mockResolvedValue({
                id: 1,
                username: "john",
                email: "john@example.com",
                role: "client",
                toJSON() {
                    return this;
                }
            });

            const res = await request(app)
                .post("/users/register")
                .send({
                    username: "john",
                    email: "john@example.com",
                    password: "123456",
                    role: "client"
                });

            expect(res.status).toBe(201);
            expect(res.body.user.email).toBe("john@example.com");
        });

        it("devrait refuser un email déjà utilisé", async () => {
            Users.findByEmail.mockResolvedValue({ id: 99 });

            const res = await request(app)
                .post("/users/register")
                .send({
                    username: "john",
                    email: "john@example.com",
                    password: "123456"
                });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Email déjà utilisé.");
        });
    });

    describe("POST /users/login", () => {

        it("devrait connecter l'utilisateur", async () => {
            const fakeUser = {
                id: 1,
                username: "john",
                email: "john@example.com",
                role: "client",
                verifyPassword: jest.fn().mockResolvedValue(true),
                toJSON() { return this; }
            };

            Users.findByEmail.mockResolvedValue(fakeUser);

            const res = await request(app)
                .post("/users/login")
                .send({ email: "john@example.com", password: "123456" });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Connexion réussie.");
            expect(res.body.token).toBeDefined();
        });

        it("devrait refuser un mauvais mot de passe", async () => {
            Users.findByEmail.mockResolvedValue({
                verifyPassword: jest.fn().mockResolvedValue(false)
            });

            const res = await request(app)
                .post("/users/login")
                .send({ email: "x@y.com", password: "wrong" });

            expect(res.status).toBe(400);
        });
    });

    const token = jwt.sign({ id: 1, role: "staff" }, JWT_SECRET);

    describe("GET /users", () => {
        it("devrait renvoyer tous les utilisateurs", async () => {
            Users.findAll.mockResolvedValue([
                { id: 1, username: "john", toJSON() { return this; } },
                { id: 2, username: "marie", toJSON() { return this; } }
            ]);

            const res = await request(app)
                .get("/users")
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
        });
    });

    describe("GET /users/:id", () => {
        it("devrait retourner un utilisateur", async () => {
            Users.findById.mockResolvedValue({
                id: 1,
                username: "john",
                toJSON() { return this; }
            });

            const res = await request(app)
                .get("/users/1")
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.username).toBe("john");
        });
    });

    describe("GET /users/me", () => {
        it("devrait retourner le profil utilisateur", async () => {
            Users.findById.mockResolvedValue({
                id: 1,
                username: "john",
                email: "john@example.com",
                role: "client"
            });

            const res = await request(app)
                .get("/users/me")
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.username).toBe("john");
        });
    });

    describe("PUT /users/:id", () => {
        it("devrait mettre à jour un utilisateur", async () => {
            Users.update.mockResolvedValue({
                id: 1,
                username: "updated",
                toJSON() { return this; }
            });

            const res = await request(app)
                .put("/users/1")
                .set("Authorization", `Bearer ${token}`)
                .send({ username: "updated" });

            expect(res.status).toBe(200);
            expect(res.body.user.username).toBe("updated");
        });
    });

    describe("DELETE /users/:id", () => {
        it("devrait supprimer un utilisateur", async () => {
            Users.delete.mockResolvedValue(true);

            const res = await request(app)
                .delete("/users/1")
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Utilisateur supprimé avec succès.");
        });
    });

});
