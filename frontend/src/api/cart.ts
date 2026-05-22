import { api } from "./client"
import type{ CartItem } from "../types/cart"

interface AddToCartResponse {
    cartItem: CartItem
    message: string
}

interface CartResponse {
    cartItems: CartItem[]
}

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