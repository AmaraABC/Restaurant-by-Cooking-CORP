import mongoose from "mongoose";

const recetteSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: { type: [String], required: true },
    etapes: { type: [String], required: true },
    temps_preparation: { type: Number, required: true },
    temps_cuisson: { type: Number, required: true },
    difficulte: { type: String, enum: ["facile", "moyen", "difficile"], default: "moyen" },
    categorie: { type: String, required: true },
    image: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("Recette", recetteSchema);
