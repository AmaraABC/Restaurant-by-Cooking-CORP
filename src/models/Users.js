import pool from "../config/db.postgres.js";
import bcrypt from "bcrypt";

export default class Users {
    #id; #username; #email; #userpassword; #userrole;

    constructor({ id, username, email, userpassword, userrole = 'client' }) {
        this.#id = id;
        this.setUsername(username);
        this.setEmail(email);
        this.#userpassword = userpassword; // déjà haché
        this.setRole(userrole);
    }

    get id() { return this.#id; }
    get username() { return this.#username; }
    get email() { return this.#email; }
    get role() { return this.#userrole; }

    setUsername(username) {
        if (!username || typeof username !== "string" || !username.trim()) {
            throw new Error("Nom d'utilisateur invalide");
        }
        this.#username = username.trim();
    }

    setEmail(email) {
        if (!email || typeof email !== "string" || !email.includes("@")) {
            throw new Error("Email invalide");
        }
        this.#email = email.trim().toLowerCase();
    }

    setRole(role) {
        const allowed = ["client", "staff"];
        if (!allowed.includes(role)) throw new Error("Rôle invalide");
        this.#userrole = role;
    }

    static async create({ username, email, password, role = "client" }) {
        const hashed = await bcrypt.hash(password, 10);
        const query = `
      INSERT INTO users (username, email, userpassword, userrole)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
        const { rows } = await pool.query(query, [username, email, hashed, role]);
        return new Users(rows[0]);
    }

    static async findByEmail(email) {
        const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (rows.length === 0) return null;
        return new Users(rows[0]);
    }

    static async findById(id) {
        const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        if (rows.length === 0) return null;
        return new Users(rows[0]);
    }

    // --- Méthodes d'instance ---
    async verifyPassword(plainPassword) {
        return await bcrypt.compare(plainPassword, this.#userpassword);
    }
}