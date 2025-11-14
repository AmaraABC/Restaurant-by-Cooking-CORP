import Plat from '../models/Plat.js';

export const getPlats = async (req , res) => {
    try {
        const plats = await Plat.find();
        res.status(200).json(plats);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

export const getPlatById = async (req, res) => {
    try {
        const plat = await Plat.findById(req.params.id);
        if (!plat) return res.status(404).json({ message: 'Plat introuvable' });
        res.status(200).json(plat);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

export const createPlat = async (req, res) => {
    try {
        const nouveauPlat = await Plat.create(req.body);
        res.status(201).json(nouveauPlat);
    } catch (error) {
        res.status(400).json({ message: 'Données invalides' });
    }
};

export const updatePlat = async (req, res) => {
    try {
        const plat = await Plat.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!plat) return res.status(404).json({ message: 'Plat introuvable' });
        res.status(200).json(plat);
    } catch (error) {
        res.status(400).json({ message: 'Données invalides' });
    }
};

export const deletePlat = async (req, res) => {
    try {
        const plat = await Plat.findByIdAndDelete(req.params.id);
        if (!plat) return res.status(404).json({ message: 'Plat introuvable' });
        res.status(200).json({ message: 'Plat supprimé' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};