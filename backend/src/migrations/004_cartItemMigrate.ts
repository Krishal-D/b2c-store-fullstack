import { Pool } from "pg"

export async function cartItemMigrate(pool: Pool): Promise<void> {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS cart_items(
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
                quantity INT NOT NULL DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `)

        console.log("Cart items table created")

    } catch (error) {
        console.error(error)
        throw error
    }
}