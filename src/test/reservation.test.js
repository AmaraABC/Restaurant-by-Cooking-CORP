import { request } from "supertest";
import app from "../../app.js";
import { pool } from "../config/db.postgres.js";

jest.setTimeout(20000);

describe("Reservation API", () => {
    let reservationId;
    const user = {
        username: `res_user_${Date.now()}`,
        email: `res_user_${Date.now()}@example.com`,
        password: "P@ssw0rd!",
        role: "client",
    };

    let accessToken;
    let tableId;

    beforeAll(async () => {
        // cleanup
        await pool.query("DELETE FROM reservation");
        await pool.query("DELETE FROM table_reservation");
        await pool.query("DELETE FROM users WHERE email = $1", [user.email]);

        // create a table
        const tableRes = await pool.query(
            "INSERT INTO table_reservation (table_number, seats, emplacement) VALUES ($1,$2,$3) RETURNING *",
            [123, 4, 'Salle test']
        );
        tableId = tableRes.rows[0].id;

        // register + login
        await request(app).post("/users/auth/register").send(user);
        const login = await request(app).post("/users/auth/login").send({ email: user.email, password: user.password });
        accessToken = login.body.accessToken;
    });

    test("POST /reservations should create a new reservation", async () => {
        const res = await request(app)
            .post("/reservations")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ table_id: tableId, reservation_time: "19:00:00", reservation_date: "2025-12-01", guests: 2 })
            .set("Accept", "application/json");

        expect([200, 201]).toContain(res.status);
        reservationId = res.body.reservation?.id || res.body.id || res.body.rows?.[0]?.id;
        expect(reservationId).toBeTruthy();
    });

    test("GET /reservations/:id should return the reservation", async () => {
        const res = await request(app).get(`/reservations/${reservationId}`).set("Accept", "application/json");
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("id");
    });

    test("DELETE /reservations/:id should delete the reservation", async () => {
        const res = await request(app)
            .delete(`/reservations/${reservationId}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .set("Accept", "application/json");

        expect([200, 204]).toContain(res.status);
    });

    afterAll(async () => {
        try {
            if (reservationId) await pool.query("DELETE FROM reservation WHERE id = $1", [reservationId]);
            if (tableId) await pool.query("DELETE FROM table_reservation WHERE id = $1", [tableId]);
            await pool.query("DELETE FROM users WHERE email = $1", [user.email]);
        } catch (err) {}
        await pool.end();
    });
});

