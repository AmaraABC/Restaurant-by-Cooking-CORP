import pool from "../config/db.postgres.js";

export default class Reservation {
    #id;
    #users_id;
    #table_id;
    #reservation_time;
    #reservation_date;
    #guests;

    constructor({ id, users_id, table_id, reservation_time, reservation_date, guests }) {
        this.#id = id;
        this.#users_id = users_id;
        this.#table_id = table_id;
        this.#reservation_time = reservation_time;
        this.#reservation_date = reservation_date;
        this.#guests = guests;
    }

    get id() { return this.#id; }
    get usersId() { return this.#users_id; }
    get tableId() { return this.#table_id; }
    get reservationTime() { return this.#reservation_time; }
    get reservationDate() { return this.#reservation_date; }
    get guests() { return this.#guests; }

    // Vérifier la disponibilité d'une table
    static async isTableAvailable(table_id, reservation_date, reservation_time) {
        const query = `
      SELECT * FROM reservation
      WHERE table_id = $1
      AND reservation_date = $2
      AND reservation_time = $3;
    `;
        const { rows } = await pool.query(query, [table_id, reservation_date, reservation_time]);
        return rows.length === 0;
    }

    static async create({ users_id, table_id, reservation_time, reservation_date, guests }) {
        const isAvailable = await this.isTableAvailable(table_id, reservation_date, reservation_time);
        if (!isAvailable) {
            throw new Error("Cette table est déjà réservée pour ce créneau.");
        }

        const query = `
      INSERT INTO reservation (users_id, table_id, reservation_time, reservation_date, guests)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
        const values = [users_id, table_id, reservation_time, reservation_date, guests];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }


    static async findAll() {
        const query = `
      SELECT r.*, u.username, t.table_number, t.emplacement
      FROM reservation r
      JOIN users u ON r.users_id = u.id
      JOIN table_reservation t ON r.table_id = t.id
      ORDER BY reservation_date, reservation_time;
    `;
        const { rows } = await pool.query(query);
        return rows;
    }

    static async findByUser(userId) {
        const query = `
      SELECT r.*, t.table_number, t.emplacement
      FROM reservation r
      JOIN table_reservation t ON r.table_id = t.id
      WHERE r.users_id = $1
      ORDER BY reservation_date DESC, reservation_time;
    `;
        const { rows } = await pool.query(query, [userId]);
        return rows;
    }

    static async findById(id) {
        const query = `
      SELECT * FROM reservation WHERE id = $1;
    `;
        const { rows } = await pool.query(query, [id]);
        return rows[0] || null;
    }

    static async update(id, updates) {
        const existing = await pool.query("SELECT * FROM reservation WHERE id = $1", [id]);
        if (existing.rows.length === 0) return null;

        const resOld = existing.rows[0];
        const query = `
      UPDATE reservation
      SET table_id = $1, reservation_time = $2, reservation_date = $3, guests = $4
      WHERE id = $5
      RETURNING *;
    `;
        const values = [
            updates.table_id ?? resOld.table_id,
            updates.reservation_time ?? resOld.reservation_time,
            updates.reservation_date ?? resOld.reservation_date,
            updates.guests ?? resOld.guests,
            id
        ];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    static async delete(id) {
        const query = "DELETE FROM reservation WHERE id = $1 RETURNING *;";
        const { rows } = await pool.query(query, [id]);
        return rows.length > 0;
    }

    // Mettre à jour une réservation (uniquement par le propriétaire ou staff)
    static async updateByUser(id, userId, updates, userRole) {
        const reservation = await this.findById(id);
        if (!reservation) throw new Error("Réservation introuvable.");

        // Vérification : le user doit être le propriétaire ou le staff
        if (userRole !== "staff" && reservation.users_id !== userId) {
            throw new Error("Action non autorisée.");
        }

        // Vérifier la disponibilité si la table ou la date/heure change
        const tableIdToCheck = updates.table_id ?? reservation.table_id;
        const dateToCheck = updates.reservation_date ?? reservation.reservation_date;
        const timeToCheck = updates.reservation_time ?? reservation.reservation_time;

        if (!(tableIdToCheck === reservation.table_id &&
            dateToCheck === reservation.reservation_date &&
            timeToCheck === reservation.reservation_time)) {
            const isAvailable = await this.isTableAvailable(tableIdToCheck, dateToCheck, timeToCheck);
            if (!isAvailable) throw new Error("Cette table est déjà réservée pour ce créneau.");
        }

        // Appel à la méthode update existante
        return await this.update(id, updates);
    }
}