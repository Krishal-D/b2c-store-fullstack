import { Pool } from "pg"

export async function userMigrate(pool: Pool): Promise<void> {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                refresh_token TEXT,
                role VARCHAR(20) DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `)

        console.log("Users table created")

    } catch (error) {
        console.error(error)
        throw error
    }
}