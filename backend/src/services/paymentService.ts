import { orderService } from "./orderService"
import { orderModel } from "../models/orderModel"

interface MockPaymentInput {
    cardName: string
    cardNumber: string
    expiry: string
    cvv: string
}

function validationError(message: string): Error {
    return Object.assign(new Error(message), { status: 400 })
}

export const paymentService = {
    async mockCheckout(userId: number, data: MockPaymentInput) {
        const { cardName, cardNumber, expiry, cvv } = data

        if (!cardName || !cardNumber || !expiry || !cvv) {
            throw validationError("All payment fields are required")
        }

        const cleanedCardNumber = String(cardNumber).replace(/\s/g, "")

        if (cleanedCardNumber !== "4242424242424242") {
            throw validationError("Use demo card number 4242 4242 4242 4242")
        }

        if (String(cvv).length < 3 || String(cvv).length > 4) {
            throw validationError("Invalid CVV")
        }

        const order = await orderService.checkout(userId)

        const paidOrder = await orderModel.updateOrderStatus(
            order.id,
            "paid"
        )

        return {
            order: paidOrder,
            payment: {
                provider: "mock",
                status: "paid"
            }
        }
    }
}