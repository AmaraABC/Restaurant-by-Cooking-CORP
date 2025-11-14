import request from "supertest";
import mongoose from "mongoose";
import app from "../server.js";
import Plat from "../models/Plat.js";
import Recette from "../models/Recette.js";

describe("Plat API", () => {
  let platId;
  let recetteId;

  beforeAll(async () => {
    const url = process.env.MONGO_URI_TEST || "mongodb://127.0.0.1/plat_test";
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

    const recette = await Recette.create({
      nom: "Recette Test",
      description: "Description de la recette",
      ingredients: ["ingrédient1", "ingrédient2"],
      etapes: ["Étape 1", "Étape 2"],
      temps_preparation: 10,
      temps_cuisson: 20,
      difficulte: "facile",
      categorie: "Dessert"
    });
    recetteId = recette._id;
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  it("devrait créer un nouveau plat", async () => {
    const res = await request(app)
      .post("/meals")
      .send({
        nom: "Plat Test",
        prix: 15.5,
        categorie: "Entrée",
        recette_id: recetteId
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.nom).toBe("Plat Test");
    platId = res.body._id;
  });

  it("devrait récupérer tous les plats", async () => {
    const res = await request(app).get("/meals");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("devrait récupérer un plat par ID", async () => {
    const res = await request(app).get(`/meals/${platId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(platId);
  });

  it("devrait mettre à jour un plat", async () => {
    const res = await request(app)
      .put(`/meals/${platId}`)
      .send({ nom: "Plat mis à jour", prix: 18 });

    expect(res.statusCode).toBe(200);
    expect(res.body.nom).toBe("Plat mis à jour");
    expect(res.body.prix).toBe(18);
  });

  it("devrait supprimer un plat", async () => {
    const res = await request(app).delete(`/meals/${platId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Plat supprimé");
  });
});
