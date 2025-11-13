import { pool } from "../config/db.postgres²js";

// Récupérer toutes les commandes
export const getAllCommandes = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM commande");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer une commande par ID
export const getCommandeById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query("SELECT * FROM commande WHERE id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Commande non trouvée" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Créer une commande
export const createCommande = async (req, res) => {
  const { utilisateur_id, prix, statut } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO commande (utilisateur_id, prix, statut) VALUES ($1, $2, $3) RETURNING *",
      [utilisateur_id, prix, statut || "en attente"]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mettre à jour une commande
export const updateCommande = async (req, res) => {
  const id = parseInt(req.params.id);
  const { prix, statut } = req.body;
  try {
    const result = await pool.query(
      "UPDATE commande SET prix=$1, statut=$2 WHERE id=$3 RETURNING *",
      [prix, statut, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "Commande non trouvée" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Supprimer une commande
export const deleteCommande = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query("DELETE FROM commande WHERE id=$1 RETURNING *", [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Commande non trouvée" });
    res.json({ message: "Commande supprimée", commande: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default {
  getAllCommandes,
  getCommandeById,
  createCommande,
  updateCommande,
  deleteCommande
};
