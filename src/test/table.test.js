import request from "supertest";
import app from "../../app.js";
import { Pool } from "../config/db.postgres.js";

jest.setTimeout(20000);

beforeAll(async () => {
    const pool = new Pool();
    await pool.query("DELETE FROM tables");
    await pool.end();
});

describe("Table API", () => {
    let tableId;
    test("POST /tables should create a new table", async () => {
        const res = await request(app)
            .post("/tables")
            .send({
                name: "Table 1",
                capacity: 4
            })
            .set("Accept", "application/json");

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("id");
        tableId = res.body.id;
    }); 
    test("GET /tables/:id should return the table", async () => {
        const res = await request(app)
            .get(`/tables/${tableId}`)
            .set("Accept", "application/json");

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("id", tableId);
    });
    test("DELETE /tables/:id should delete the table", async () => {
        const res = await request(app)
            .delete(`/tables/${tableId}`)
            .set("Accept", "application/json");

        expect(res.status).toBe(204);
    });
});
afterAll(async () => {
    const pool = new Pool();
    await pool.end();
}); 