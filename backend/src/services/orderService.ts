import { cartModel } from "../models/cartModel"
import { orderModel } from "../models/orderModel"
import { productModel } from "../models/productModel"
import {
    httpError,
    parsePositiveInteger,
    validationError
} from "../utils/httpError"
import { withTransaction } from "../utils/transaction"

export const orderService = {

    async checkout(userId: number) {

        return withTransaction(async (client) => {
            const cartItems = await cartModel.getCartItemsForCheckout(
                userId,
                client
            )

            if (cartItems.length === 0) {
                throw validationError("Cart is empty")
            }

            let totalAmount = 0

            for (const item of cartItems) {
                const productName = item.name ?? `product ${item.product_id}`
                const stockQuantity = item.stock_quantity ?? 0

                if (item.quantity <= 0) {
                    throw validationError(`Invalid quantity for ${productName}`)
                }

                if (stockQuantity < item.quantity) {
                    throw validationError(`Not enough stock for ${productName}`)
                }

                totalAmount += Number(item.price) * item.quantity
            }

            const order = await orderModel.createOrder(
                userId,
                totalAmount,
                client
            )

            for (const item of cartItems) {
                const reducedProduct = await productModel.reduceStock(
                    item.product_id,
                    item.quantity,
                    client
                )

                if (!reducedProduct) {
                    throw validationError(`Not enough stock for ${item.name ?? "product"}`)
                }

                await orderModel.createOrderItem(
                    order.id,
                    item.product_id,
                    item.quantity,
                    Number(item.price),
                    client
                )

                await cartModel.deleteCartItem(item.id, userId, client)
            }

            return order
        })
    },

    async getOrders(userId: number) {
        return orderModel.getOrdersByUser(userId)
    },

    async getOrderItems(
        orderId: unknown,
        userId: number,
        role: string
    ) {
        const parsedOrderId = parsePositiveInteger(orderId, "Order id")

        const order = await orderModel.getOrderById(parsedOrderId)

        if (!order) {
            throw httpError("Order not found", 404)
        }

        if (role !== "admin" && order.user_id !== userId) {
            throw httpError("Access denied", 403)
        }

        return orderModel.getOrderItems(parsedOrderId)
    },

    async getAllOrders() {
        return orderModel.getAllOrders()
    },
}