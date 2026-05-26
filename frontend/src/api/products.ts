import { api } from "./client"
import type { Product } from "../types"

interface ProductsResponse {
    products: Product[]
}

interface ProductResponse {
    product: Product
}

export async function getProducts(): Promise<Product[]> {
    const response = await api.get<ProductsResponse>("/products")
    return response.data.products
}

export async function getProductById(
    productId: number
): Promise<Product> {
    const response = await api.get<ProductResponse>(
        `/products/${productId}`
    )

    return response.data.product
}