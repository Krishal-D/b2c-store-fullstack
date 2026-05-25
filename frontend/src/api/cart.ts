import { api } from "./client"
import type { CartItem } from "../types/cart"
import type { AddToCartResponse, CartResponse, DeleteCartItemResponse, UpdateCartItemResponse } from "../types/cart"

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

export async function deleteCartItem(
    token: string,
    cartItemId: number
): Promise<DeleteCartItemResponse> {
    const response = await api.delete<DeleteCartItemResponse>(
        `/cart/${cartItemId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

    return response.data
}

export async function updateCartItem(
    token: string,
    cartItemId: number,
    quantity: number
): Promise<UpdateCartItemResponse> {
    const response = await api.patch<UpdateCartItemResponse>(
        `/cart/${cartItemId}`,
        { quantity },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

    return response.data
}