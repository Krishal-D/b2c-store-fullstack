import type { Request, Response, NextFunction } from "express"
import { productService } from "../services/productServices"

export const productController = {
    async getProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const { search, categoryId } = req.query

            const products = await productService.getProducts(search, categoryId)

            return res.status(200).json({
                products
            })

        } catch (error) {
            next(error)
        }
    },

    async getProductById(req: Request, res: Response, next: NextFunction) {
        try {
            const product = await productService.getProductById(req.params.id)

            return res.status(200).json({
                product
            })

        } catch (error) {
            next(error)
        }
    },

    async createProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const product = await productService.createProduct(req.body)

            return res.status(201).json({
                product,
                message: "Product created successfully"
            })

        } catch (error) {
            next(error)
        }
    },

    async updateProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const product = await productService.updateProduct(
                req.params.id,
                req.body
            )

            return res.status(200).json({
                product,
                message: "Product updated successfully"
            })

        } catch (error) {
            next(error)
        }
    },

    async deleteProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const product = await productService.deleteProduct(req.params.id)

            return res.status(200).json({
                product,
                message: "Product deleted successfully"
            })

        } catch (error) {
            next(error)
        }
    }
}