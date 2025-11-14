import { request } from "supertest";
import app from "../../app.js";
import authRoutes from "../routes/auth.routes.js";
import { pool } from "../config/db.postgres.js";


jest.setTimeout(20000);

describe("Authentication API", () => {
    
    const testUser = {
        username: `testuser_${Date.now()}`,
        email: `testuser_${Date.now()}@example.com`,
        password: "P@ssw0rd!",
        role: "client"
    };

   
    let refreshToken = null;

    
    beforeAll(() => {
        
        app.use("/auth", authRoutes);
    });

    test("POST /users/auth/register should create a new user and return tokens", async () => {
        const res = await request(app)
            .post("/users/auth/register")
            .send(testUser)
            .set("Accept", "application/json");

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("user");
        expect(res.body.user).toHaveProperty("id");
        expect(res.body.user.username).toBe(testUser.username);
        expect(res.body).toHaveProperty("accessToken");
        expect(res.body).toHaveProperty("refreshToken");

        
        refreshToken = res.body.refreshToken;
    });

    test("POST /users/auth/login should authenticate and return tokens", async () => {
        const res = await request(app)
            .post("/users/auth/login")
            .send({ email: testUser.email, password: testUser.password })
            .set("Accept", "application/json");

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("user");
        expect(res.body.user).toHaveProperty("id");
        expect(res.body).toHaveProperty("accessToken");
        expect(res.body).toHaveProperty("refreshToken");

        
        refreshToken = res.body.refreshToken;
    });

    test("POST /auth/refresh should return a new access token when given a valid refresh token", async () => {
        expect(refreshToken).toBeTruthy();

        const res = await request(app)
            .post("/auth/refresh")
            .send({ token: refreshToken })
            .set("Accept", "application/json");

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("accessToken");
        expect(typeof res.body.accessToken).toBe("string");
    });

    afterAll(async () => {
        
        try {
            await pool.query("DELETE FROM users WHERE email = $1", [testUser.email]);
        } catch (err) {
            console.error("Erreur lors du nettoyage des tests :", err);
        }

        await pool.end();
    });
});

