import Recette from "../models/recette.model.js";

export const getRecettes = async (req, res) => {
  try {
    const recettes = await Recette.find();
    res.status(200).json(recettes);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const getRecetteById = async (req, res) => {
  try {
    const recette = await Recette.findById(req.params.id);
    if (!recette) return res.status(404).json({ message: "Recette introuvable" });
    res.status(200).json(recette);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const createRecette = async (req, res) => {
  try {
    const nouvelleRecette = await Recette.create(req.body);
    res.status(201).json(nouvelleRecette);
  } catch (error) {
    res.status(400).json({ message: "Données invalides" });
  }
};

export const updateRecette = async (req, res) => {
  try {
    const recette = await Recette.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!recette) return res.status(404).json({ message: "Recette introuvable" });
    res.status(200).json(recette);
  } catch (error) {
    res.status(400).json({ message: "Données invalides" });
  }
};

export const deleteRecette = async (req, res) => {
  try {
    const recette = await Recette.findByIdAndDelete(req.params.id);
    if (!recette) return res.status(404).json({ message: "Recette introuvable" });
    res.status(200).json({ message: "Recette supprimée" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

