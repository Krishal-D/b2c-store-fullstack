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

        const existingCartItem = await cartModel.findCartItemByUserAndProduct(
            userId,
            data.product_id
        )

        if (existingCartItem) {
            return cartModel.updateCartItem(
                {
                    quantity: existingCartItem.quantity + data.quantity
                },
                existingCartItem.id,
                userId
            )
        }

        return cartModel.addCartItem(userId, data)
    },

    async updateCartItem(
        userId: number,
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
            data,
            cartItemId,
            userId
        )

        if (!cartItem) {
            throw Object.assign(
                new Error("Cart item not found"),
                { status: 404 }
            )
        }

        return cartItem
    },

    async deleteCartItem(id: unknown, userId: number) {

        const cartItemId = Number(id)

        if (!Number.isInteger(cartItemId) || cartItemId <= 0) {
            throw validationError("Invalid cart item id")
        }

        const cartItem = await cartModel.deleteCartItem(cartItemId, userId)

        if (!cartItem) {
            throw Object.assign(
                new Error("Cart item not found"),
                { status: 404 }
            )
        }

        return cartItem
    }
}