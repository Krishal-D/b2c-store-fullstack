import type { Request, Response, NextFunction } from "express"
import { categoryService } from "../services/categoryService"

export const categoryController = {

    async getCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const categories = await categoryService.getCategories()

            return res.status(200).json({ categories })

        } catch (error) {
            next(error)
        }
    },

    async createCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const { name } = req.body

            const category = await categoryService.createCategory(name)

            return res.status(201).json({
                category,
                message: "Category created successfully"
            })

        } catch (error) {
            next(error)
        }
    }
}