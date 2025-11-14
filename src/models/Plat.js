import mongoose from "mongoose";

const platShema = new mongoose.Schema(
    {
        nom: { type: String, required: true },
        prix: { type: Number, required: true },
        categorie: { type: String, required: true }, 
        recette_id: { type: mongoose.Schema.Types.ObjectId, ref: "Recette", required: true }
    },
    { timestamps: true

    }
)

export default mongoose.model("Plat", platShema);
