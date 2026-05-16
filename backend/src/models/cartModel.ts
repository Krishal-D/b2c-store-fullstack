import { pool } from "../config/db"
import {
    AddCartItemInput,
    CartItem,
    UpdateCartItemInput
} from "../types/cartTypes"

export const cartModel = {

    async getCartItems(userId: number): Promise<CartItem[]> {
        const result = await pool.query(
            `
            SELECT * FROM cart_items
            WHERE user_id = $1
            ORDER BY created_at DESC
            `,
            [userId]
        )

        return result.rows
    },

    async addCartItem(
        userId: number,
        data: AddCartItemInput
    ): Promise<CartItem> {

        const result = await pool.query(
            `
            INSERT INTO cart_items
            (user_id, product_id, quantity)
            VALUES ($1, $2, $3)
            RETURNING *
            `,
            [
                userId,
                data.product_id,
                data.quantity
            ]
        )

        return result.rows[0]
    },

    async updateCartItem(
        data: UpdateCartItemInput,
        id: number,
        userId: number
    ): Promise<CartItem | null> {

        const result = await pool.query(
            `
            UPDATE cart_items
            SET quantity = $1
            WHERE id = $2 AND user_id=$3
            RETURNING *
            `,
            [
                data.quantity,
                id,
                userId
            ]
        )

        return result.rows[0] || null
    },

    async deleteCartItem(id: number, userId: number): Promise<CartItem | null> {
        const result = await pool.query(
            `
            DELETE FROM cart_items
            WHERE id = $1 AND user_id=$2
            RETURNING *
            `,
            [id, userId]
        )

        return result.rows[0] || null
    },
    async findCartItemByUserAndProduct(
        userId: number,
        productId: number
    ): Promise<CartItem | null> {
        const result = await pool.query(
            `
        SELECT * FROM cart_items
        WHERE user_id = $1 AND product_id = $2
        `,
            [userId, productId]
        )

        return result.rows[0] || null
    },
}