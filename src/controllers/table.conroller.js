import { pool } from "../config/db.postgres.js";

// Récupérer toutes les tables
export const getAllTables = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM table_reservation");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer une table par ID
export const getTableById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query("SELECT * FROM table_reservation WHERE id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Table non trouvée" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Créer une nouvelle table
export const createTable = async (req, res) => {
  const { numero, nombre_place, emplacement } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO table_reservation (numero, nombre_place, emplacement) VALUES ($1, $2, $3) RETURNING *",
      [numero, nombre_place, emplacement]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mettre à jour une table
export const updateTable = async (req, res) => {
  const id = parseInt(req.params.id);
  const { numero, nombre_place, emplacement } = req.body;
  try {
    const result = await pool.query(
      "UPDATE table_reservation SET numero=$1, nombre_place=$2, emplacement=$3 WHERE id=$4 RETURNING *",
      [numero, nombre_place, emplacement, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "Table non trouvée" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Supprimer une table
export const deleteTable = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query("DELETE FROM table_reservation WHERE id=$1 RETURNING *", [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Table non trouvée" });
    res.json({ message: "Table supprimée", table: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default {
  getAllTables,
  getTableById,
  createTable,
  updateTable,
  deleteTable
};