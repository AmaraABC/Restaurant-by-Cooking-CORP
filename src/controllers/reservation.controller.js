import Reservation from "../models/Reservation.js";

export const createReservation = async (req, res) => {
  try {
    const { table_id, reservation_time, reservation_date, guests } = req.body;
    const users_id = req.user.id; // récupéré via le middleware d'authentification

    if (!table_id || !reservation_time || !reservation_date || !guests) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    const newReservation = await Reservation.create({
      users_id,
      table_id,
      reservation_time,
      reservation_date,
      guests
    });

    res.status(201).json({
      message: "Réservation créée avec succès.",
      reservation: newReservation
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll();
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyReservations = async (req, res) => {
  try {
    const userId = req.user.id;
    const reservations = await Reservation.findByUser(userId);
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReservationById = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findById(id);
    if (!reservation) return res.status(404).json({ message: "Réservation non trouvée." });
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user.id;      // récupéré depuis le JWT
    const userRole = req.user.role;  // 'client' ou 'staff'

    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ message: "Réservation introuvable." });
    }

    if (userRole !== "staff" && reservation.users_id !== userId) {
      return res.status(403).json({ message: "Action non autorisée." });
    }

    const tableIdToCheck = updates.table_id ?? reservation.table_id;
    const dateToCheck = updates.reservation_date ?? reservation.reservation_date;
    const timeToCheck = updates.reservation_time ?? reservation.reservation_time;

    if (!(tableIdToCheck === reservation.table_id &&
      dateToCheck === reservation.reservation_date &&
      timeToCheck === reservation.reservation_time)) {
      const isAvailable = await Reservation.isTableAvailable(tableIdToCheck, dateToCheck, timeToCheck);
      if (!isAvailable) {
        return res.status(400).json({ message: "Cette table est déjà réservée pour ce créneau." });
      }
    }

    const updated = await Reservation.update(id, updates);

    res.status(200).json({
      message: "Réservation mise à jour avec succès.",
      reservation: updated
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Vérifie si la réservation existe
    const reservation = await Reservation.findById(id);
    if (!reservation) return res.status(404).json({ message: "Réservation introuvable." });

    // Règle de sécurité : un user peut supprimer seulement la sienne
    if (userRole !== "staff" && reservation.users_id !== userId) {
      return res.status(403).json({ message: "Action non autorisée." });
    }

    const deleted = await Reservation.delete(id);
    if (!deleted) return res.status(404).json({ message: "Suppression échouée." });

    res.status(200).json({ message: "Réservation supprimée avec succès." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};