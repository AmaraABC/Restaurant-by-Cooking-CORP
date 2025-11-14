import pool from "../config/db.postgres.js";
import bcrypt from "bcrypt";

export default class Users {
    #id;
    #username;
    #email;
    #userpassword;
    #userrole;

    constructor({ id, username, email, userpassword, userrole = "client" }) {
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
            throw new Error("Nom d'utilisateur invalide.");
        }
        this.#username = username.trim();
    }

    setEmail(email) {
        if (!email || typeof email !== "string" || !email.includes("@")) {
            throw new Error("Email invalide.");
        }
        this.#email = email.trim().toLowerCase();
    }

    setRole(role) {
        const allowed = ["client", "staff"];
        if (!allowed.includes(role)) {
            throw new Error("Rôle invalide.");
        }
        this.#userrole = role;
    }

    toJSON() {
        return {
            id: this.#id,
            username: this.#username,
            email: this.#email,
            role: this.#userrole
        };
    }

    static async create({ username, email, password, role = "client" }) {
        const hashed = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO users (username, email, userpassword, userrole)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [username, email, hashed, role];

        const { rows } = await pool.query(query, values);
        return new Users(rows[0]);
    }

    static async findByEmail(email) {
        const { rows } = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        return rows.length ? new Users(rows[0]) : null;
    }

    static async findById(id) {
        const { rows } = await pool.query(
            "SELECT * FROM users WHERE id = $1",
            [id]
        );
        return rows.length ? new Users(rows[0]) : null;
    }

    static async findAll() {
        const { rows } = await pool.query(
            "SELECT id, username, email, userrole FROM users ORDER BY id ASC;"
        );
        return rows.map(row => new Users(row));
    }

    static async update(id, updates, userRole, requesterId) {
        const user = await this.findById(id);
        if (!user) throw new Error("Utilisateur introuvable.");

        if (userRole !== "staff" && requesterId !== user.id) {
            throw new Error("Action non autorisée.");
        }

        const newUsername = updates.username ?? user.username;
        const newEmail = updates.email ?? user.email;
        const newRole = updates.role ?? user.role;

        user.setUsername(newUsername);
        user.setEmail(newEmail);
        user.setRole(newRole);

        const query = `
            UPDATE users
            SET username = $1, email = $2, userrole = $3
            WHERE id = $4
            RETURNING *;
        `;

        const values = [newUsername, newEmail, newRole, id];

        const { rows } = await pool.query(query, values);
        return new Users(rows[0]);
    }

    static async delete(id, requesterRole, requesterId) {
        const user = await this.findById(id);
        if (!user) return false;

        if (requesterRole !== "staff" && requesterId !== id) {
            throw new Error("Action non autorisée.");
        }

        const { rows } = await pool.query(
            "DELETE FROM users WHERE id = $1 RETURNING *;",
            [id]
        );

        return rows.length > 0;
    }

    async verifyPassword(plainPassword) {
        return await bcrypt.compare(plainPassword, this.#userpassword);
    }
}