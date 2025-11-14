import request from "supertest";
import app from "../server.js";
import TableReservation from "../models/TableReservation.js";

jest.mock("../models/TableReservation.js");

describe("📌 Tests TableReservation API", () => {
    describe("POST /tables", () => {
        it("devrait créer une nouvelle table", async () => {

            const mockTable = {
                id: 1,
                tableNumber: 10,
                seats: 4,
                emplacement: "salle"
            };

            TableReservation.create.mockResolvedValue(mockTable);

            const response = await request(app)
                .post("/tables")
                .send({
                    table_number: 10,
                    seats: 4,
                    emplacement: "salle"
                });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe("Table ajoutée avec succès.");
            expect(response.body.table).toHaveProperty("id", 1);
        });

        it("devrait renvoyer une erreur si table_number ou seats manquent", async () => {
            const response = await request(app)
                .post("/tables")
                .send({ seats: 4 });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("table_number et seats sont requis.");
        });
    });

    describe("GET /tables", () => {
        it("devrait retourner toutes les tables", async () => {

            const mockTables = [
                { id: 1, tableNumber: 1, seats: 4, emplacement: "terrasse" },
                { id: 2, tableNumber: 2, seats: 2, emplacement: "salle" }
            ];

            TableReservation.findAll.mockResolvedValue(mockTables);

            const response = await request(app).get("/tables");

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(2);
        });
    });

    describe("GET /tables/:id", () => {
        it("devrait retourner une table par ID", async () => {

            const mockTable = { id: 1, tableNumber: 3, seats: 6, emplacement: "salle" };

            TableReservation.findById.mockResolvedValue(mockTable);

            const response = await request(app).get("/tables/1");

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("id", 1);
        });

        it("devrait renvoyer 404 si la table est introuvable", async () => {

            TableReservation.findById.mockResolvedValue(null);

            const response = await request(app).get("/tables/999");

            expect(response.status).toBe(404);
            expect(response.body.message).toBe("Table introuvable");
        });
    });

    describe("PUT /tables/:id", () => {
        it("devrait mettre à jour une table", async () => {

            const mockUpdated = {
                id: 1,
                tableNumber: 5,
                seats: 4,
                emplacement: "terrasse"
            };

            TableReservation.update.mockResolvedValue(mockUpdated);

            const response = await request(app)
                .put("/tables/1")
                .send({ seats: 4 });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Table mise à jour avec succès.");
            expect(response.body.table).toHaveProperty("table_number", 5);
        });

        it("devrait renvoyer 404 si la table n'existe pas", async () => {

            TableReservation.update.mockResolvedValue(null);

            const response = await request(app)
                .put("/tables/999")
                .send({ seats: 4 });

            expect(response.status).toBe(404);
            expect(response.body.message).toBe("Table non trouvée");
        });
    });

    describe("DELETE /tables/:id", () => {
        it("devrait supprimer une table", async () => {

            TableReservation.delete.mockResolvedValue(true);

            const response = await request(app).delete("/tables/1");

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Table supprimée avec succès.");
        });

        it("devrait renvoyer 404 si la table n'existe pas", async () => {

            TableReservation.delete.mockResolvedValue(false);

            const response = await request(app).delete("/tables/999");

            expect(response.status).toBe(404);
            expect(response.body.message).toBe("Table non trouvée");
        });
    });

});