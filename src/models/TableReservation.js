import pool from "../config/db.postgres.js";

export default class TableReservation {
    #id;
    #table_number;
    #seats;
    #emplacement;

    constructor({ id, table_number, seats, emplacement }) {
        this.#id = id;
        this.#table_number = table_number;
        this.#seats = seats;
        this.#emplacement = emplacement;
    }

    get id() { return this.#id; }
    get tableNumber() { return this.#table_number; }
    get seats() { return this.#seats; }
    get emplacement() { return this.#emplacement; }

    static async findAll() {
        const { rows } = await pool.query("SELECT * FROM table_reservation ORDER BY id ASC;");
        return rows.map(row => ({
            id: row.id,
            table_number: row.table_number,
            seats: row.seats,
            emplacement: row.emplacement
        }));
    }

    static async findById(id) {
        const { rows } = await pool.query("SELECT * FROM table_reservation WHERE id = $1;", [id]);
        if (rows.length === 0) return null;
        const row = rows[0];
        return {
            id: row.id,
            table_number: row.table_number,
            seats: row.seats,
            emplacement: row.emplacement
        };
    }

    static async update(id, updates) {
        const existing = await pool.query("SELECT * FROM table_reservation WHERE id = $1", [id]);
        if (existing.rows.length === 0) return null;

        const table = existing.rows[0];

        const table_number = updates.table_number ?? table.table_number;
        const seats = updates.seats ?? table.seats;
        const emplacement = updates.emplacement ?? table.emplacement;

        const query = `
      UPDATE table_reservation
      SET table_number = $1, seats = $2, emplacement = $3
      WHERE id = $4
      RETURNING *;
    `;
        const values = [table_number, seats, emplacement, id];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    static async delete(id) {
        const query = "DELETE FROM table_reservation WHERE id = $1 RETURNING *;";
        const { rows } = await pool.query(query, [id]);
        return rows.length > 0;
    }
}