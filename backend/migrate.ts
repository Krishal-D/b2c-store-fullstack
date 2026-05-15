import {
    userMigrate,
    categoryMigrate,
    productMigrate,
    cartItemMigrate,
    orderMigrate,
    orderItemMigrate,
    reviewMigrate
} from './src/migrations'

import { pool } from './src/config/db'

async function runMigration() {
    try {
        await userMigrate(pool)
        await categoryMigrate(pool)
        await productMigrate(pool)
        await cartItemMigrate(pool)
        await orderMigrate(pool)
        await orderItemMigrate(pool)
        await reviewMigrate(pool)

        console.log("All migrations completed successfully")

    } catch (error) {
        console.log("Migration failed:", error)

    } finally {
        await pool.end()
    }
}

runMigration()