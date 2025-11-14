import request from "supertest";
import app from "../app.js";

// Mock du modèle
jest.mock("../models/Reservation.js", () => ({
    create: jest.fn(),
    findAll: jest.fn(),
    findByUser: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    isTableAvailable: jest.fn()
}));

import Reservation from "../models/Reservation.js";

// Mock du middleware authenticate
jest.mock("../middlewares/auth.middleware.js", () => ({
    authenticate: (req, res, next) => {
        req.user = { id: 1, role: "client" }; // user par défaut
        next();
    }
}));

// Mock du middleware role staff
jest.mock("../middlewares/role.middleware.js", () => ({
    authorize: () => (req, res, next) => {
        if (req.user.role !== "staff") {
            return res.status(403).json({ message: "Accès refusé" });
        }
        next();
    }
}));

describe("Reservations API", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("POST /reservations → crée une réservation", async () => {
        const reservationMock = {
            id: 1,
            users_id: 1,
            table_id: 2,
            reservation_time: "19:00",
            reservation_date: "2025-01-10",
            guests: 4
        };

        Reservation.create.mockResolvedValue(reservationMock);

        const res = await request(app)
            .post("/reservations")
            .send({
                table_id: 2,
                reservation_time: "19:00",
                reservation_date: "2025-01-10",
                guests: 4
            });

        expect(res.status).toBe(201);
        expect(res.body.reservation).toEqual(reservationMock);
    });

    it("GET /reservations (staff) → récupère toutes les réservations", async () => {
        // Force le rôle staff
        const staffUser = { id: 99, role: "staff" };

        Reservation.findAll.mockResolvedValue([
            { id: 1, table_id: 2 },
            { id: 2, table_id: 3 }
        ]);

        const res = await request(app)
            .get("/reservations")
            .set("Authorization", "Bearer token")
            .set("x-test-user", JSON.stringify(staffUser)); // injecté via middleware custom en test

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);
    });

    it("GET /reservations/my → récupère les réservations de l’utilisateur", async () => {
        Reservation.findByUser.mockResolvedValue([
            { id: 1, users_id: 1 },
            { id: 2, users_id: 1 }
        ]);

        const res = await request(app).get("/reservations/my");

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);
    });

    it("GET /reservations/:id → retourne une réservation", async () => {
        Reservation.findById.mockResolvedValue({ id: 1 });

        const res = await request(app).get("/reservations/1");

        expect(res.status).toBe(200);
        expect(res.body.id).toBe(1);
    });

    it("GET /reservations/:id → erreur si réservation introuvable", async () => {
        Reservation.findById.mockResolvedValue(null);

        const res = await request(app).get("/reservations/99");

        expect(res.status).toBe(404);
    });

    it("PUT /reservations/:id → met à jour une réservation", async () => {
        const existing = {
            id: 1,
            users_id: 1,
            table_id: 3,
            reservation_time: "19:00",
            reservation_date: "2025-02-02"
        };

        Reservation.findById.mockResolvedValue(existing);
        Reservation.isTableAvailable.mockResolvedValue(true);
        Reservation.update.mockResolvedValue({
            ...existing,
            guests: 5
        });

        const res = await request(app)
            .put("/reservations/1")
            .send({ guests: 5 });

        expect(res.status).toBe(200);
        expect(res.body.reservation.guests).toBe(5);
    });

    it("PUT /reservations/:id → interdit si user ≠ propriétaire", async () => {
        const existing = { id: 1, users_id: 999 };

        Reservation.findById.mockResolvedValue(existing);

        const res = await request(app)
            .put("/reservations/1")
            .send({ guests: 3 });

        expect(res.status).toBe(403);
    });

    it("PUT /reservations/:id → refuse si table indisponible", async () => {
        const existing = {
            id: 1,
            users_id: 1,
            table_id: 2,
            reservation_time: "19:00",
            reservation_date: "2025-03-10"
        };

        Reservation.findById.mockResolvedValue(existing);
        Reservation.isTableAvailable.mockResolvedValue(false);

        const res = await request(app)
            .put("/reservations/1")
            .send({ table_id: 3 });

        expect(res.status).toBe(400);
    });

    it("DELETE /reservations/:id → supprime une réservation", async () => {
        const reservation = { id: 1, users_id: 1 };

        Reservation.findById.mockResolvedValue(reservation);
        Reservation.delete.mockResolvedValue(true);

        const res = await request(app).delete("/reservations/1");

        expect(res.status).toBe(200);
    });

    it("DELETE /reservations/:id → refuse si user ≠ propriétaire", async () => {
        const reservation = { id: 1, users_id: 987 };

        Reservation.findById.mockResolvedValue(reservation);

        const res = await request(app).delete("/reservations/1");

        expect(res.status).toBe(403);
    });

    it("DELETE /reservations/:id → erreur si réservation introuvable", async () => {
        Reservation.findById.mockResolvedValue(null);

        const res = await request(app).delete("/reservations/123");

        expect(res.status).toBe(404);
    });
});