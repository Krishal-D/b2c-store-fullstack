import { cartModel } from "../models/cartModel"
import { productModel } from "../models/productModel"
import {
    AddCartItemInput,
    UpdateCartItemInput
} from "../types/cartTypes"
import {
    httpError,
    parsePositiveInteger,
    validationError
} from "../utils/httpError"

export const cartService = {

    async getCartItems(userId: number) {
        return cartModel.getCartItems(userId)
    },

    async addCartItem(
        userId: number,
        data: AddCartItemInput
    ) {

        const productId = parsePositiveInteger(data.product_id, "Product id")
        const quantity = parsePositiveInteger(data.quantity, "Quantity")
        const product = await productModel.getProductById(productId)

        const existingCartItem = await cartModel.findCartItemByUserAndProduct(
            userId,
            productId
        )

        if (!product) {
            throw httpError("Product not found", 404)
        }

        const nextQuantity = (existingCartItem?.quantity ?? 0) + quantity

        if (nextQuantity > product.stock_quantity) {
            throw validationError(`Only ${product.stock_quantity} item(s) available for ${product.name}`)
        }

        if (existingCartItem) {
            return cartModel.updateCartItem(
                {
                    quantity: nextQuantity
                },
                existingCartItem.id,
                userId
            )
        }

        return cartModel.addCartItem(userId, {
            product_id: productId,
            quantity
        })
    },

    async updateCartItem(
        userId: number,
        id: unknown,
        data: UpdateCartItemInput
    ) {

        const cartItemId = parsePositiveInteger(id, "Cart item id")
        const quantity = parsePositiveInteger(data.quantity, "Quantity")
        const cartItem = await cartModel.getCartItems(userId)
            .then(items => items.find(item => item.id === cartItemId))

        if (!cartItem) {
            throw httpError("Cart item not found", 404)
        }

        if (
            typeof cartItem.stock_quantity === "number" &&
            quantity > cartItem.stock_quantity
        ) {
            throw validationError(`Only ${cartItem.stock_quantity} item(s) available for ${cartItem.name}`)
        }

        const updatedCartItem = await cartModel.updateCartItem(
            { quantity },
            cartItemId,
            userId
        )

        if (!updatedCartItem) {
            throw httpError("Cart item not found", 404)
        }

        return updatedCartItem
    },

    async deleteCartItem(id: unknown, userId: number) {

        const cartItemId = parsePositiveInteger(id, "Cart item id")

        const cartItem = await cartModel.deleteCartItem(cartItemId, userId)

        if (!cartItem) {
            throw httpError("Cart item not found", 404)
        }

        return cartItem
    }
}