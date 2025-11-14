import { request } from "supertest";
import app from "../server.js";
import { Pool } from "../config/db.postgres.js";

jest.setTimeout(20000);
beforeAll(async () => {
    const pool = new Pool();
    await pool.query("DELETE FROM orders");
    await pool.end();
});

describe("Order API", () => {
    let orderId;
    test("POST /orders should create a new order", async () => {
        const res = await request(app)
            .post("/orders")
            .send({
                tableId: 1,
                items: [
                    { productId: 1, quantity: 2 },
                    { productId: 2, quantity: 1 }
                ]
            })
            .set("Accept", "application/json");

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("id");
        orderId = res.body.id;
    });
    test("GET /orders/:id should return the order", async () => {
        const res = await request(app)
            .get(`/orders/${orderId}`)
            .set("Accept", "application/json");

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("id", orderId);
    });
    test("DELETE /orders/:id should delete the order", async () => {
        const res = await request(app)
            .delete(`/orders/${orderId}`)
            .set("Accept", "application/json");

        expect(res.status).toBe(204);
    });
});
afterAll(async () => {
    const pool = new Pool();
    await pool.end();
});
