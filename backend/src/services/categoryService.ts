import { categoryModel } from "../models/categoryModel"

function validationError(message: string): Error {
    return Object.assign(new Error(message), { status: 400 })
}

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