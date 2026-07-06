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

        await pool.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1
                    FROM pg_constraint
                    WHERE conname = 'cart_items_quantity_positive'
                ) THEN
                    ALTER TABLE cart_items
                    ADD CONSTRAINT cart_items_quantity_positive CHECK (quantity > 0);
                END IF;
            END
            $$;
        `)

        await pool.query(`
            CREATE UNIQUE INDEX IF NOT EXISTS cart_items_user_product_unique
            ON cart_items(user_id, product_id)
        `)

        console.log("Cart items table created")

    } catch (error) {
        console.error(error)
        throw error
    }
}