export interface Order {
    id: number
    user_id: number
    total_amount: string
    status: string
    created_at: string
}

export interface CheckoutResponse {
    order: Order
    message: string
}

export interface OrderItem {
    id: number
    order_id: number
    product_id: number
    quantity: number
    price: string
    name: string
    description: string
    image_url: string | null
}