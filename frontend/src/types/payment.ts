import type { Order } from "./order"

export interface MockPaymentInput {
    cardName: string
    cardNumber: string
    expiry: string
    cvv: string
}

export interface MockPaymentResponse {
    order: Order
    payment: {
        provider: string
        status: string
    }
    message: string
}