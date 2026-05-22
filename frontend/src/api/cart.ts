import { api } from "./client"
import type { CartItem } from "../types/cart"
import type { AddToCartResponse, CartResponse } from "../types/cart"

export async function addToCart(
    token: string,
    productId: number,
    quantity = 1
): Promise<AddToCartResponse> {
    const response = await api.post<AddToCartResponse>(
        "/cart",
        {
            product_id: productId,
            quantity
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

    return response.data
}

export async function getCartItems(token: string): Promise<CartItem[]> {
    const response = await api.get<CartResponse>("/cart", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return response.data.cartItems
}