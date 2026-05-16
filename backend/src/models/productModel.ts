import { pool } from "../config/db"
import {
    CreateProductInput,
    Product,
    UpdateProductInput
} from "../types/productTypes"

export const productModel = {
    async getAllProducts(
        limit: number,
        offset: number,
        sortBy: string,
        sortOrder: string
    ): Promise<Product[]> {
        const allowedSortBy = ["created_at", "price", "name"]
        const safeSortBy = allowedSortBy.includes(sortBy) ? sortBy : "created_at"
        const safeSortOrder = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC"

        const result = await pool.query(
            `
        SELECT * FROM products
        ORDER BY ${safeSortBy} ${safeSortOrder}
        LIMIT $1 OFFSET $2
        `,
            [limit, offset]
        )

        return result.rows
    },

    async getProductById(id: number): Promise<Product | null> {
        const result = await pool.query(
            `SELECT * FROM products WHERE id = $1`,
            [id]
        )

        return result.rows[0] || null
    },

    async createProduct(data: CreateProductInput): Promise<Product> {
        const result = await pool.query(
            `
            INSERT INTO products 
            (name, description, price, image_url, stock_quantity, category_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
            `,
            [
                data.name,
                data.description,
                data.price,
                data.image_url || null,
                data.stock_quantity,
                data.category_id || null
            ]
        )

        return result.rows[0]
    },

    async updateProduct(id: number, data: UpdateProductInput): Promise<Product | null> {
        const result = await pool.query(
            `
            UPDATE products
            SET
                name = COALESCE($1, name),
                description = COALESCE($2, description),
                price = COALESCE($3, price),
                image_url = COALESCE($4, image_url),
                stock_quantity = COALESCE($5, stock_quantity),
                category_id = COALESCE($6, category_id)
            WHERE id = $7
            RETURNING *
            `,
            [
                data.name,
                data.description,
                data.price,
                data.image_url,
                data.stock_quantity,
                data.category_id,
                id
            ]
        )

        return result.rows[0] || null
    },

    async deleteProduct(id: number): Promise<Product | null> {
        const result = await pool.query(
            `DELETE FROM products WHERE id = $1 RETURNING *`,
            [id]
        )

        return result.rows[0] || null
    },

    async searchProducts(search: string): Promise<Product[]> {
        const result = await pool.query(
            `
        SELECT * FROM products
        WHERE LOWER(name) LIKE LOWER($1)
        ORDER BY created_at DESC
        `,
            [`%${search}%`]
        )

        return result.rows
    },

    async filterProductsByCategory(categoryId: number): Promise<Product[]> {
        const result = await pool.query(
            `
        SELECT * FROM products
        WHERE category_id = $1
        ORDER BY created_at DESC
        `,
            [categoryId]
        )

        return result.rows
    },

    async reduceStock(
        productId: number,
        quantity: number
    ): Promise<void> {
        await pool.query(
            `
        UPDATE products
        SET stock_quantity = stock_quantity - $1
        WHERE id = $2
        `,
            [quantity, productId]
        )
    }
}