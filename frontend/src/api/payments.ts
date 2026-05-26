import { api } from "./client"

import type {
    MockPaymentInput,
    MockPaymentResponse
} from "../types/payment"

export async function mockCheckoutPayment(
    token: string,
    paymentData: MockPaymentInput
): Promise<MockPaymentResponse> {

    const response = await api.post<MockPaymentResponse>(
        "/payments/mock-checkout",
        paymentData,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

    return response.data
}