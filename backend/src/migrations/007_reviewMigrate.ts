import { Pool } from "pg"

export async function reviewMigrate(pool: Pool): Promise<void> {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS reviews(
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
                rating INT CHECK (rating >= 1 AND rating <= 5),
                comment TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `)

        console.log("Reviews table created")

    } catch (error) {
        console.error(error)
        throw error
    }
}