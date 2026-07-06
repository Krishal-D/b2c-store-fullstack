import { productModel } from "../models/productModel"
import { CreateProductInput, UpdateProductInput } from "../types/productTypes"
import {
    httpError,
    parsePositiveInteger,
    validationError
} from "../utils/httpError"

export const productService = {
    async getProducts(search?: unknown, categoryId?: unknown, page?: unknown, limit?: unknown, sortBy?: unknown, sortOrder?: unknown) {
        if (search && typeof search === "string") {
            return productModel.searchProducts(search.trim())
        }

        if (categoryId) {
            const parsedCategoryId = Number(categoryId)

            if (!Number.isInteger(parsedCategoryId) || parsedCategoryId <= 0) {
                throw validationError("Invalid category id")
            }

            return productModel.filterProductsByCategory(parsedCategoryId)
        }
        const parsedPage = Number(page) || 1
        const parsedLimit = Number(limit) || 10
        const offset = (parsedPage - 1) * parsedLimit

        return productModel.getAllProducts(
            parsedLimit,
            offset,
            typeof sortBy === "string" ? sortBy : "created_at",
            typeof sortOrder === "string" ? sortOrder : "DESC"
        )
    },

    async getProductById(id: unknown) {
        const productId = parsePositiveInteger(id, "Product id")

        const product = await productModel.getProductById(productId)

        if (!product) {
            throw httpError("Product not found", 404)
        }

        return product
    },

    async createProduct(data: CreateProductInput) {
        if (!data.name || !data.name.trim()) throw validationError("Product name is required")
        if (!data.description || !data.description.trim()) throw validationError("Product description is required")
        if (!Number.isFinite(Number(data.price)) || Number(data.price) <= 0) throw validationError("Product price must be greater than 0")
        if (!Number.isInteger(Number(data.stock_quantity)) || Number(data.stock_quantity) < 0) throw validationError("Stock quantity cannot be negative")

        return productModel.createProduct(data)
    },

    async updateProduct(id: unknown, data: UpdateProductInput) {
        const productId = parsePositiveInteger(id, "Product id")

        if (data.price !== undefined && (!Number.isFinite(Number(data.price)) || Number(data.price) <= 0)) throw validationError("Product price must be greater than 0")
        if (data.stock_quantity !== undefined && (!Number.isInteger(Number(data.stock_quantity)) || Number(data.stock_quantity) < 0)) throw validationError("Stock quantity cannot be negative")

        const product = await productModel.updateProduct(productId, data)

        if (!product) {
            throw httpError("Product not found", 404)
        }

        return product
    },

    async deleteProduct(id: unknown) {
        const productId = parsePositiveInteger(id, "Product id")

        const product = await productModel.deleteProduct(productId)

        if (!product) {
            throw httpError("Product not found", 404)
        }

        return product
    }
}