import request from "supertest";
import mongoose from "mongoose";
import app from "../server.js";
import Recette from "../models/Recette.js";

describe("Recette API", () => {
    beforeAll(async () => {
        const url = process.env.MONGO_URI_TEST || "mongodb://127.0.0.1/recette_test";
        await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    });

    let recetteId;

    it("devrait créer une nouvelle recette", async () => {
        const res = await request(app)
            .post("/recipes")
            .send({
                nom: "Test Recette",
                description: "Description de test",
                ingredients: ["ingrédient1", "ingrédient2"],
                etapes: ["Étape 1", "Étape 2"],
                temps_preparation: 10,
                temps_cuisson: 20,
                difficulte: "facile",
                categorie: "Dessert",
                image: "http://example.com/image.jpg"
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body.nom).toBe("Test Recette");
        recetteId = res.body._id;
    });

    it("devrait récupérer toutes les recettes", async () => {
        const res = await request(app).get("/recipes");
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it("devrait récupérer une recette par ID", async () => {
        const res = await request(app).get(`/recipes/${recetteId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body._id).toBe(recetteId);
    });

    it("devrait mettre à jour une recette", async () => {
        const res = await request(app)
            .put(`/recipes/${recetteId}`)
            .send({ nom: "Recette mise à jour" });

        expect(res.statusCode).toEqual(200);
        expect(res.body.nom).toBe("Recette mise à jour");
    });

    it("devrait supprimer une recette", async () => {
        const res = await request(app).delete(`/recipes/${recetteId}`);
        expect(res.statusCode).toEqual(200);
    });
});
