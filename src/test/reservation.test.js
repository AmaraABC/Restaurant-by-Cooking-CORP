import { request } from "supertest";
import app from "../../app.js";
import { Pool } from "../config/db.postgres.js";

jest.setTimeout(20000);

beforeAll(async () => {
    const pool = new Pool();
    await pool.query("DELETE FROM reservations");
    await pool.end();
});

describe("Reservation API", () => {
    let reservationId;

    test("POST /reservations should create a new reservation", async () => {
        const res = await request(app)
            .post("/reservations")
            .send({
                userId: 1,
                tableId: 1,
                reservationTime: new Date(),
            })
            .set("Accept", "application/json");

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("id");
        reservationId = res.body.id;
    });

    test("GET /reservations/:id should return the reservation", async () => {
        const res = await request(app)
            .get(`/reservations/${reservationId}`)
            .set("Accept", "application/json");

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("id", reservationId);
    });

    test("DELETE /reservations/:id should delete the reservation", async () => {
        const res = await request(app)
            .delete(`/reservations/${reservationId}`)
            .set("Accept", "application/json");

        expect(res.status).toBe(204);
    });
});
afterAll(async () => {
    const pool = new Pool();
    await pool.end();
});

