import { api } from "./client"
import type { Product, CreateProductInput } from "../types"

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

export async function createProduct(
    token: string,
    productData: CreateProductInput
) {
    const response = await api.post(
        "/products",
        productData,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

    return response.data
}

export async function deleteProduct(
    token: string,
    productId: number
) {
    const response = await api.delete(
        `/products/${productId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

    return response.data
}

export async function updateProduct(
    token: string,
    productId: number,
    productData: Partial<CreateProductInput>
) {
    const response = await api.patch(
        `/products/${productId}`,
        productData,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

    return response.data
}