import { pool } from "../config/db"
import { Category } from "../types/categoryTypes"

export const categoryModel = {

    async getCategories(): Promise<Category[]> {
        const result = await pool.query(`
            SELECT * FROM categories
            ORDER BY name ASC
        `)

        return result.rows
    },

    async createCategory(name: string): Promise<Category> {
        const result = await pool.query(
            `
            INSERT INTO categories (name)
            VALUES ($1)
            RETURNING *
            `,
            [name]
        )

        return result.rows[0]
    }
}