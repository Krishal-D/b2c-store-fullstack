import { pool } from "../config/db"
import { Order, OrderItem } from "../types/orderTypes"

export const orderModel = {

    async createOrder(
        userId: number,
        totalAmount: number
    ): Promise<Order> {

        const result = await pool.query(
            `
            INSERT INTO orders
            (user_id, total_amount)
            VALUES ($1, $2)
            RETURNING *
            `,
            [userId, totalAmount]
        )

        return result.rows[0]
    },

    async createOrderItem(
        orderId: number,
        productId: number,
        quantity: number,
        price: number
    ): Promise<OrderItem> {

        const result = await pool.query(
            `
            INSERT INTO order_items
            (order_id, product_id, quantity, price)
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `,
            [
                orderId,
                productId,
                quantity,
                price
            ]
        )

        return result.rows[0]
    },

    async getOrdersByUser(userId: number): Promise<Order[]> {
        const result = await pool.query(
            `
            SELECT * FROM orders
            WHERE user_id = $1
            ORDER BY created_at DESC
            `,
            [userId]
        )

        return result.rows
    },

    async getOrderItems(orderId: number): Promise<OrderItem[]> {
        const result = await pool.query(
            `
        SELECT 
            order_items.id,
            order_items.order_id,
            order_items.product_id,
            order_items.quantity,
            order_items.price,
            products.name,
            products.description,
            products.image_url
        FROM order_items
        JOIN products
        ON order_items.product_id = products.id
        WHERE order_items.order_id = $1
        `,
            [orderId]
        )

        return result.rows
    },
    async getAllOrders(): Promise<Order[]> {
        const result = await pool.query(`
        SELECT * FROM orders
        ORDER BY created_at DESC
    `)

        return result.rows
    },
    async getOrderById(orderId: number): Promise<Order | null> {
        const result = await pool.query(
            `
        SELECT * FROM orders
        WHERE id = $1
        `,
            [orderId]
        )

        return result.rows[0] || null
    }
}