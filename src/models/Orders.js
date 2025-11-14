import pool from "../config/db.postgres.js";

export default class Orders {
    #id;
    #users_id;
    #order_status;
    #price;
    #created_at;

    constructor({ id, users_id, order_status, price, created_at }) {
        this.#id = id;
        this.#users_id = users_id;
        this.#order_status = order_status;
        this.#price = price;
        this.#created_at = created_at;
    }

    get id() { return this.#id; }
    get usersId() { return this.#users_id; }
    get status() { return this.#order_status; }
    get price() { return this.#price; }
    get createdAt() { return this.#created_at; }

    static async create({ users_id, price, order_status = "en attente" }) {
        const query = `
            INSERT INTO orders (users_id, price, order_status)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const values = [users_id, price, order_status];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    static async findAll() {
        const query = `
            SELECT o.*, u.username
            FROM orders o
            JOIN users u ON o.users_id = u.id
            ORDER BY created_at DESC;
        `;
        const { rows } = await pool.query(query);
        return rows;
    }

    static async findByUser(userId) {
        const query = `
            SELECT * FROM orders
            WHERE users_id = $1
            ORDER BY created_at DESC;
        `;
        const { rows } = await pool.query(query, [userId]);
        return rows;
    }

    static async findById(id) {
        const query = `SELECT * FROM orders WHERE id = $1`;
        const { rows } = await pool.query(query, [id]);
        return rows[0] || null;
    }

    static async updateByUser(id, userId, updates, userRole) {
        const order = await this.findById(id);
        if (!order) throw new Error("Commande introuvable.");

        if (userRole !== "staff" && order.users_id !== userId) {
            throw new Error("Action non autorisée.");
        }

        const query = `
            UPDATE orders
            SET 
                order_status = $1,
                price = $2
            WHERE id = $3
            RETURNING *;
        `;

        const values = [
            updates.order_status ?? order.order_status,
            updates.price ?? order.price,
            id
        ];

        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    static async deleteByUser(id, userId, userRole) {
        const order = await this.findById(id);
        if (!order) return false;

        if (userRole !== "staff" && order.users_id !== userId) {
            throw new Error("Action non autorisée.");
        }

        const query = `DELETE FROM orders WHERE id = $1 RETURNING *;`;
        const { rows } = await pool.query(query, [id]);
        return rows.length > 0;
    }
}