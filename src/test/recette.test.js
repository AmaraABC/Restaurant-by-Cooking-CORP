import request from "supertest";
import app from "../../app.js";
import mongoose from "mongoose";
import recetteRoutes from "../routes/recette.routes.js";
import Recette from "../models/Recette.js";

jest.setTimeout(20000);

describe("Recette API (Mongo)", () => {
    let recetteId;

    beforeAll(async () => {
        const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/restaurant";
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        // mount the recette routes under /recettes for testing (app.js doesn't mount them by default)
        app.use("/recettes", recetteRoutes);
        await Recette.deleteMany({});
    });

    test("POST /recettes should create a new recette", async () => {
        const payload = {
            nom: "Tarte aux pommes",
            description: "Délicieuse tarte",
            ingredients: ["pommes", "sucre", "pâte"],
            etapes: ["Préparer", "Cuire"],
            temps_preparation: 30,
            temps_cuisson: 45,
            difficulte: "facile",
            categorie: "dessert"
        };

        const res = await request(app)
            .post("/recettes")
            .send(payload)
            .set("Accept", "application/json");

        expect([200,201]).toContain(res.status);
        // depending on controller response shape
        recetteId = res.body._id || res.body.id || res.body._doc?._id;
        expect(recetteId).toBeTruthy();
    });

    test("GET /recettes should list recettes", async () => {
        const res = await request(app).get("/recettes");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test("GET /recettes/:id should return the recette", async () => {
        const res = await request(app).get(`/recettes/${recetteId}`);
        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
    });

    test("PUT /recettes/:id should update the recette", async () => {
        const res = await request(app)
            .put(`/recettes/${recetteId}`)
            .send({ description: "Nouvelle description" });
        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
    });

    test("DELETE /recettes/:id should remove the recette", async () => {
        const res = await request(app).delete(`/recettes/${recetteId}`);
        expect([200,204]).toContain(res.status);
    });

    afterAll(async () => {
        await Recette.deleteMany({});
        await mongoose.connection.close();
    });
});
