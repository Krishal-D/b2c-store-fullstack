import { pool } from "../config/db"
import { RegisterInput, User } from "../types/authTypes"

export const userModel = {

    async findUserByEmail(email: string): Promise<User | null> {
        const result = await pool.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        )

        return result.rows[0] || null
    },

    async createUser(name: string, email: string, hashedPassword: string): Promise<User> {
        const result = await pool.query(
            `
            INSERT INTO users (name, email, password)
            VALUES ($1, $2, $3)
            RETURNING *
            `,
            [name, email, hashedPassword]
        )

        return result.rows[0]
    },

    async updateRefreshToken(userId: number, refreshToken: string): Promise<void> {
        await pool.query(
            `UPDATE users SET refresh_token = $1 WHERE id = $2`,
            [refreshToken, userId]
        )
    },

    async removeRefreshToken(userId: number): Promise<void> {
        await pool.query(
            `UPDATE users SET refresh_token = NULL WHERE id = $1`,
            [userId]
        )
    }

}