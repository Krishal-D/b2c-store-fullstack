import { categoryModel } from "../models/categoryModel"
import { validationError } from "../utils/httpError"

export const categoryService = {

    async getCategories() {
        return categoryModel.getCategories()
    },

    async createCategory(name: unknown) {
        if (!name || typeof name !== "string" || !name.trim()) {
            throw validationError("Category name is required")
        }

        return categoryModel.createCategory(name.trim())
    }
}