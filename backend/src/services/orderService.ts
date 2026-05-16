import { cartModel } from "../models/cartModel"
import { orderModel } from "../models/orderModel"
import { productModel } from "../models/productModel"

function validationError(message: string): Error {
    return Object.assign(new Error(message), { status: 400 })
}

export const orderService = {

    async checkout(userId: number) {

        const cartItems = await cartModel.getCartItems(userId)

        if (cartItems.length === 0) {
            throw validationError("Cart is empty")
        }

        let totalAmount = 0

        for (const item of cartItems) {

            const product = await productModel.getProductById(
                item.product_id
            )


            if (!product) {
                throw Object.assign(
                    new Error(`Product ${item.product_id} not found`),
                    { status: 404 }
                )
            }

            if (product.stock_quantity < item.quantity) {
                throw Object.assign(
                    new Error(`Not enough stock for ${product.name}`),
                    { status: 400 }
                )
            }

            totalAmount += Number(product.price) * item.quantity
        }

        const order = await orderModel.createOrder(
            userId,
            totalAmount
        )

        for (const item of cartItems) {

            const product = await productModel.getProductById(
                item.product_id
            )

            if (!product) {
                continue
            }

            await orderModel.createOrderItem(
                order.id,
                item.product_id,
                item.quantity,
                Number(product.price)
            )

            await productModel.reduceStock(
                item.product_id,
                item.quantity
            )


            await cartModel.deleteCartItem(item.id, userId)
        }

        return order
    },

    async getOrders(userId: number) {
        return orderModel.getOrdersByUser(userId)
    },

    async getOrderItems(orderId: unknown) {

        const parsedOrderId = Number(orderId)

        if (!Number.isInteger(parsedOrderId) || parsedOrderId <= 0) {
            throw validationError("Invalid order id")
        }

        return orderModel.getOrderItems(parsedOrderId)
    },

    async getAllOrders() {
        return orderModel.getAllOrders()
    },
}