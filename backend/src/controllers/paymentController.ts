import type { Request, Response, NextFunction } from "express"
import { paymentService } from "../services/paymentService"

export const paymentController = {
    async mockCheckout(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    message: "Unauthorized"
                })
            }

            const result = await paymentService.mockCheckout(
                req.user.id,
                req.body
            )

            return res.status(201).json({
                order: result.order,
                payment: result.payment,
                message: "Mock payment completed successfully"
            })
        } catch (error) {
            next(error)
        }
    }
}