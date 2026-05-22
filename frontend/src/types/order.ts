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