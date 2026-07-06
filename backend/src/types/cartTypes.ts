export interface CartItem {
    id: number
    user_id: number
    product_id: number
    quantity: number
    created_at: Date
    name?: string
    description?: string
    price?: string
    image_url?: string | null
    stock_quantity?: number
}

export interface AddCartItemInput {
    product_id: number
    quantity: number
}

export interface UpdateCartItemInput {
    quantity: number
}