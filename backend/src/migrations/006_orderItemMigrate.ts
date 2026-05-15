import { Pool } from "pg"

export async function orderItemMigrate(pool: Pool): Promise<void> {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS order_items(
                id SERIAL PRIMARY KEY,
                order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
                product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
                quantity INT NOT NULL,
                price NUMERIC(10, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `)

        console.log("Order items table created")

    } catch (error) {
        console.error(error)
        throw error
    }
}