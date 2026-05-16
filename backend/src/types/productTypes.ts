export interface Product {
    id: number
    name: string
    description: string
    price: string
    image_url: string | null
    stock_quantity: number
    category_id: number | null
    created_at: Date
}

export interface CreateProductInput {
    name: string
    description: string
    price: number
    image_url?: string | null
    stock_quantity: number
    category_id?: number | null
}

export interface UpdateProductInput {
    name?: string
    description?: string
    price?: number
    image_url?: string | null
    stock_quantity?: number
    category_id?: number | null
}