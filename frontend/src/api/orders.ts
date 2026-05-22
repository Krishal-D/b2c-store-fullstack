import { api } from "./client"
import type { CheckoutResponse, Order, OrderItem } from "../types/order"

interface OrdersResponse {
    orders: Order[]
}

interface OrderItemsResponse {
    orderItems: OrderItem[]
}

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

export async function getOrders(
    token: string
): Promise<Order[]> {
    const response = await api.get<OrdersResponse>(
        "/orders",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

    return response.data.orders
}

export async function getOrderItems(
    token: string,
    orderId: number
): Promise<OrderItem[]> {
    const response = await api.get<OrderItemsResponse>(
        `/orders/${orderId}/items`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

    return response.data.orderItems
}