import { orderService } from "./orderService"
import { orderModel } from "../models/orderModel"
import { validationError } from "../utils/httpError"

interface MockPaymentInput {
    cardName: string
    cardNumber: string
    expiry: string
    cvv: string
}

export const paymentService = {
    async mockCheckout(userId: number, data: MockPaymentInput) {
        const { cardName, cardNumber, expiry, cvv } = data
        const cleanedCardName = String(cardName ?? "").trim()
        const cleanedCardNumber = String(cardNumber ?? "").replace(/\s/g, "")
        const cleanedExpiry = String(expiry ?? "").trim()
        const cleanedCvv = String(cvv ?? "").trim()

        if (
            !cleanedCardName ||
            !cleanedCardNumber ||
            !cleanedExpiry ||
            !cleanedCvv
        ) {
            throw validationError("All payment fields are required")
        }

        if (cleanedCardNumber !== "4242424242424242") {
            throw validationError("Use demo card number 4242 4242 4242 4242")
        }

        if (!/^\d{3,4}$/.test(cleanedCvv)) {
            throw validationError("Invalid CVV")
        }

        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cleanedExpiry)) {
            throw validationError("Expiry must use MM/YY format")
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