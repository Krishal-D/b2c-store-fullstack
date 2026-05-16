export interface Order {
    id: number
    user_id: number
    total_amount: string
    status: string
    created_at: Date
}

export interface OrderItem {
    id: number
    order_id: number
    product_id: number
    quantity: number
    price: string
    created_at: Date
}