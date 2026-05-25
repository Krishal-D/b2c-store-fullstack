import { api } from "./client"
import type { Category } from "../types"

interface CategoriesResponse {
    categories: Category[]
}

export async function getCategories(): Promise<Category[]> {
    const response = await api.get<CategoriesResponse>("/categories")

    return response.data.categories
}