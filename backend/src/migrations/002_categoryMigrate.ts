import { Pool } from "pg"

export async function categoryMigrate(pool: Pool): Promise<void> {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS categories(
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `)

        console.log("Categories table created")

    } catch (error) {
        console.error(error)
        throw error
    }
}