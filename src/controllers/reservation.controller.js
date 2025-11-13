import { pool } from "../config/db.postgres.js";

// Récupérer toutes les réservations
export const getAllReservations = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM reservation");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer une réservation par ID
export const getReservationById = async (req, res) => {
  const id = parseInt(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "ID invalide" });
  try {
    const result = await pool.query("SELECT * FROM reservation WHERE id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Réservation non trouvée" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Créer une réservation
export const createReservation = async (req, res) => {
  // On prend l'utilisateur depuis le token si disponible pour éviter l'usurpation
  const { utilisateur_id: bodyUserId, table_id, heure, jour, invites } = req.body;
  const utilisateur_id = req.user?.id ?? bodyUserId;

  // Validations basiques
  if (!utilisateur_id) return res.status(400).json({ error: "utilisateur_id manquant" });
  if (!table_id) return res.status(400).json({ error: "table_id manquant" });
  if (!heure) return res.status(400).json({ error: "heure manquante" });
  if (!jour) return res.status(400).json({ error: "jour manquant" });
  if (invites == null || Number.isNaN(Number(invites))) return res.status(400).json({ error: "invites invalide" });
  try {
    const result = await pool.query(
      "INSERT INTO reservation (utilisateur_id, table_id, heure, jour, invites) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [utilisateur_id, table_id, heure, jour, invites]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Mettre à jour une réservation
export const updateReservation = async (req, res) => {
  const id = parseInt(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "ID invalide" });
  const { table_id, heure, jour, invites } = req.body;
  if (!table_id && !heure && !jour && invites == null) return res.status(400).json({ error: "Aucun champ à mettre à jour" });
  try {
    // Si req.user présent, vérifier la propriété (pour éviter que n'importe qui modifie)
    if (req.user) {
      const ownerCheck = await pool.query("SELECT utilisateur_id FROM reservation WHERE id=$1", [id]);
      if (ownerCheck.rows.length === 0) return res.status(404).json({ error: "Réservation non trouvée" });
      if (ownerCheck.rows[0].utilisateur_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: "Accès refusé" });
      }
    }
    const result = await pool.query(
      "UPDATE reservation SET table_id=$1, heure=$2, jour=$3, invites=$4 WHERE id=$5 RETURNING *",
      [table_id, heure, jour, invites, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "Réservation non trouvée" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Supprimer une réservation
export const deleteReservation = async (req, res) => {
  const id = parseInt(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "ID invalide" });
  try {
    // Vérifier la propriété si req.user présent
    if (req.user) {
      const ownerCheck = await pool.query("SELECT utilisateur_id FROM reservation WHERE id=$1", [id]);
      if (ownerCheck.rows.length === 0) return res.status(404).json({ error: "Réservation non trouvée" });
      if (ownerCheck.rows[0].utilisateur_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: "Accès refusé" });
      }
    }
    const result = await pool.query("DELETE FROM reservation WHERE id=$1 RETURNING *", [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Réservation non trouvée" });
    res.json({ message: "Réservation supprimée", reservation: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export default {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation
};  