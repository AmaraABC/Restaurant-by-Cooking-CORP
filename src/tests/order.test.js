import request from "supertest";
import app from "../server.js";
import jwt from "jsonwebtoken";
import Orders from "../models/Orders.js";

jest.mock("../models/Orders.js");

const clientToken = jwt.sign(
    { id: 1, role: "client" },
    process.env.JWT_SECRET || "testsecret"
);

const staffToken = jwt.sign(
    { id: 2, role: "staff" },
    process.env.JWT_SECRET || "testsecret"
);

describe("Orders API", () => {
    test("POST /orders - créer une commande (client)", async () => {
        const mockOrder = {
            id: 10,
            users_id: 1,
            price: 25.90,
            order_status: "en attente"
        };

        Orders.create.mockResolvedValue(mockOrder);

        const res = await request(app)
            .post("/orders")
            .set("Authorization", `Bearer ${clientToken}`)
            .send({ price: 25.90 });

        expect(res.statusCode).toBe(201);
        expect(res.body.order).toEqual(mockOrder);
    });

    test("POST /orders - échec si prix manquant", async () => {
        const res = await request(app)
            .post("/orders")
            .set("Authorization", `Bearer ${clientToken}`)
            .send({});

        expect(res.statusCode).toBe(400);
    });

    test("GET /orders - accessible uniquement au staff", async () => {
        Orders.findAll.mockResolvedValue([]);

        const res = await request(app)
            .get("/orders")
            .set("Authorization", `Bearer ${staffToken}`);

        expect(res.statusCode).toBe(200);
    });

    test("GET /orders - refusé pour un client", async () => {
        const res = await request(app)
            .get("/orders")
            .set("Authorization", `Bearer ${clientToken}`);

        expect(res.statusCode).toBe(403);
    });

    test("GET /orders/my - récupère les commandes du client connecté", async () => {
        const mockOrders = [
            { id: 1, users_id: 1, price: 10.0 },
            { id: 2, users_id: 1, price: 20.0 }
        ];

        Orders.findByUser.mockResolvedValue(mockOrders);

        const res = await request(app)
            .get("/orders/my")
            .set("Authorization", `Bearer ${clientToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(2);
    });

    test("GET /orders/:id - client peut voir sa propre commande", async () => {
        const mockOrder = {
            id: 5,
            users_id: 1,
            price: 15.5
        };

        Orders.findById.mockResolvedValue(mockOrder);

        const res = await request(app)
            .get("/orders/5")
            .set("Authorization", `Bearer ${clientToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.price).toBe(15.5);
    });

    test("GET /orders/:id - client ne peut PAS voir celle d’un autre client", async () => {
        Orders.findById.mockResolvedValue({
            id: 5,
            users_id: 99,
            price: 15.5
        });

        const res = await request(app)
            .get("/orders/5")
            .set("Authorization", `Bearer ${clientToken}`);

        expect(res.statusCode).toBe(403);
    });

    test("PUT /orders/:id - client peut modifier sa commande", async () => {
        const updatedOrder = {
            id: 7,
            users_id: 1,
            price: 30,
            order_status: "en attente"
        };

        Orders.updateByUser.mockResolvedValue(updatedOrder);

        const res = await request(app)
            .put("/orders/7")
            .set("Authorization", `Bearer ${clientToken}`)
            .send({ price: 30 });

        expect(res.statusCode).toBe(200);
        expect(res.body.order.price).toBe(30);
    });

    test("DELETE /orders/:id - client supprime sa propre commande", async () => {
        Orders.deleteByUser.mockResolvedValue(true);

        const res = await request(app)
            .delete("/orders/7")
            .set("Authorization", `Bearer ${clientToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/supprimée/);
    });

    test("DELETE /orders/:id - renvoie 404 si commande introuvable", async () => {
        Orders.deleteByUser.mockResolvedValue(null);

        const res = await request(app)
            .delete("/orders/99")
            .set("Authorization", `Bearer ${clientToken}`);

        expect(res.statusCode).toBe(404);
    });
});