import { api } from "./client"

export interface Product {
    id: number
    name: string
    description: string
    price: string
    image_url: string | null
    stock_quantity: number
    category_id: number | null
    created_at: string
}

interface ProductsResponse {
    products: Product[]
}

export async function getProducts(): Promise<Product[]> {
    const response = await api.get<ProductsResponse>("/products")
    return response.data.products
}