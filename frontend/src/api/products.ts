import { api } from "./client"
import type { Product } from "../types"

interface ProductsResponse {
    products: Product[]
}

export async function getProducts(): Promise<Product[]> {
    const response = await api.get<ProductsResponse>("/products")
    return response.data.products
}