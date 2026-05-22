import { api } from "./client"
import type { CheckoutResponse } from "../types/order"

export async function checkout(
    token: string
): Promise<CheckoutResponse> {
    const response = await api.post<CheckoutResponse>(
        "/orders/checkout",
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

    return response.data
}