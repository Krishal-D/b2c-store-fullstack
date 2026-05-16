import { cartModel } from "../models/cartModel"
import {
    AddCartItemInput,
    UpdateCartItemInput
} from "../types/cartTypes"

function validationError(message: string): Error {
    return Object.assign(new Error(message), { status: 400 })
}

export const cartService = {

    async getCartItems(userId: number) {
        return cartModel.getCartItems(userId)
    },

    async addCartItem(
        userId: number,
        data: AddCartItemInput
    ) {

        if (!data.product_id || data.product_id <= 0) {
            throw validationError("Valid product id is required")
        }

        if (!data.quantity || data.quantity <= 0) {
            throw validationError("Quantity must be greater than 0")
        }

        return cartModel.addCartItem(userId, data)
    },

    async updateCartItem(
        id: unknown,
        data: UpdateCartItemInput
    ) {

        const cartItemId = Number(id)

        if (!Number.isInteger(cartItemId) || cartItemId <= 0) {
            throw validationError("Invalid cart item id")
        }

        if (!data.quantity || data.quantity <= 0) {
            throw validationError("Quantity must be greater than 0")
        }

        const cartItem = await cartModel.updateCartItem(
            cartItemId,
            data
        )

        if (!cartItem) {
            throw Object.assign(
                new Error("Cart item not found"),
                { status: 404 }
            )
        }

        return cartItem
    },

    async deleteCartItem(id: unknown) {

        const cartItemId = Number(id)

        if (!Number.isInteger(cartItemId) || cartItemId <= 0) {
            throw validationError("Invalid cart item id")
        }

        const cartItem = await cartModel.deleteCartItem(cartItemId)

        if (!cartItem) {
            throw Object.assign(
                new Error("Cart item not found"),
                { status: 404 }
            )
        }

        return cartItem
    }
}