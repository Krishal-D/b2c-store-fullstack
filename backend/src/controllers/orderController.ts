import type { Request, Response, NextFunction } from "express"
import { orderService } from "../services/orderService"

export const orderController = {
    async checkout(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Unauthorized" })
            }

            const order = await orderService.checkout(req.user.id)

            return res.status(201).json({
                order,
                message: "Checkout completed successfully"
            })
        } catch (error) {
            next(error)
        }
    },

    async getOrders(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Unauthorized" })
            }

            const orders = await orderService.getOrders(req.user.id)

            return res.status(200).json({ orders })
        } catch (error) {
            next(error)
        }
    },

    async getOrderItems(req: Request, res: Response, next: NextFunction) {
        try {
            const orderItems = await orderService.getOrderItems(req.params.id)

            return res.status(200).json({ orderItems })
        } catch (error) {
            next(error)
        }
    },

    async getAllOrders(req: Request, res: Response, next: NextFunction) {
        try {
            const orders = await orderService.getAllOrders()

            return res.status(200).json({ orders })

        } catch (error) {
            next(error)
        }
    }

}