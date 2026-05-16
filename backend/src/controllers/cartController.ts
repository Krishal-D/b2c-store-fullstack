import type { Request, Response, NextFunction } from "express"
import { cartService } from "../services/cartServices"

export const cartController = {

    async getCartItems(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {

            if (!req.user) {
                return res.status(401).json({
                    message: "Unauthorized"
                })
            }

            const cartItems = await cartService.getCartItems(
                req.user.id
            )

            return res.status(200).json({
                cartItems
            })

        } catch (error) {
            next(error)
        }
    },

    async addCartItem(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {

            if (!req.user) {
                return res.status(401).json({
                    message: "Unauthorized"
                })
            }

            const cartItem = await cartService.addCartItem(
                req.user.id,
                req.body
            )

            return res.status(201).json({
                cartItem,
                message: "Item added to cart"
            })

        } catch (error) {
            next(error)
        }
    },

    async updateCartItem(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {

            const cartItem = await cartService.updateCartItem(
                req.params.id,
                req.body
            )

            return res.status(200).json({
                cartItem,
                message: "Cart item updated"
            })

        } catch (error) {
            next(error)
        }
    },

    async deleteCartItem(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {

            const cartItem = await cartService.deleteCartItem(
                req.params.id
            )

            return res.status(200).json({
                cartItem,
                message: "Cart item deleted"
            })

        } catch (error) {
            next(error)
        }
    }
}