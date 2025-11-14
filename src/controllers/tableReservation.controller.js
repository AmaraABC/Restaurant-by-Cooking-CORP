import TableReservation from "../models/TableReservation.js";

export const createTable = async (req, res) => {
  try {
    const { table_number, seats, emplacement } = req.body;

    if (!table_number || !seats) {
      return res.status(400).json({ message: "table_number et seats sont requis." });
    }

    const newTable = await TableReservation.create({ table_number, seats, emplacement });
    res.status(201).json({
      message: "Table ajoutée avec succès.",
      table: {
        id: newTable.id,
        table_number: newTable.tableNumber,
        seats: newTable.seats,
        emplacement: newTable.emplacement,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllTables = async (req, res) => {
  try {
    const tables = await TableReservation.findAll();
    res.status(200).json(tables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTableById = async (req, res) => {
  try {
    const { id } = req.params;
    const table = await TableReservation.findById(id);
    if (!table) return res.status(404).json({ message: "Table introuvable" });
    res.status(200).json(table);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTable = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = await TableReservation.update(id, updates);
    if (!updated) return res.status(404).json({ message: "Table non trouvée" });

    res.status(200).json({
      message: "Table mise à jour avec succès.",
      table: {
        id: updated.id,
        table_number: updated.tableNumber,
        seats: updated.seats,
        emplacement: updated.emplacement
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTable = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await TableReservation.delete(id);

    if (!deleted) return res.status(404).json({ message: "Table non trouvée" });

    res.status(200).json({ message: "Table supprimée avec succès." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
