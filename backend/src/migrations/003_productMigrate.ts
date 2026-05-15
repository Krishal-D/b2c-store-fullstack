import { Pool } from "pg"

export async function productMigrate(pool: Pool): Promise<void> {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS products(
                id SERIAL PRIMARY KEY,
                name VARCHAR(150) NOT NULL,
                description TEXT NOT NULL,
                price NUMERIC(10, 2) NOT NULL,
                image_url TEXT,
                stock_quantity INT NOT NULL DEFAULT 0,
                category_id INT REFERENCES categories(id) ON DELETE SET NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `)

        console.log("Products table created")

    } catch (error) {
        console.error(error)
        throw error
    }
}