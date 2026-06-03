import { authService } from "../services/authService"
import { userModel } from "../models/userModel"
import type {
    Request,
    Response,
    NextFunction,
    CookieOptions
} from "express"

function cookieOptions(withMaxAge = true): CookieOptions {
    const isProduction = process.env.NODE_ENV === "production"

    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        ...(withMaxAge && {
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
    }
}

export const authController = {

    async register(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { name, email, password } = req.body

            const result = await authService.register(
                name,
                email,
                password
            )

            res.cookie(
                "refreshToken",
                result.refreshToken,
                cookieOptions()
            )

            return res.status(201).json({
                token: result.accessToken,
                user: result.user,
                message: "Created new account"
            })

        } catch (error) {
            next(error)
        }
    },

    async login(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { email, password } = req.body

            const result = await authService.login(
                email,
                password
            )

            res.cookie(
                "refreshToken",
                result.refreshToken,
                cookieOptions()
            )

            return res.status(200).json({
                token: result.accessToken,
                user: result.user,
                message: "Successfully logged in"
            })

        } catch (error) {
            next(error)
        }
    },

    async logout(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const refreshToken = req.cookies?.refreshToken

            await authService.logout(refreshToken)

            res.clearCookie(
                "refreshToken",
                cookieOptions(false)
            )

            return res.status(200).json({
                message: "Logged out successfully"
            })

        } catch (error) {
            next(error)
        }
    },

    async refresh(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const refreshToken = req.cookies?.refreshToken

            const result = await authService.refresh(refreshToken)

            res.cookie(
                "refreshToken",
                result.newRefreshToken,
                cookieOptions()
            )

            return res.status(200).json({
                token: result.newAccessToken,
                user:result.user,
                message: "New tokens created successfully"
            })

        } catch (error) {
            next(error)
        }
    },

    async updateProfile(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            if (!req.user) return res.status(401).json({ message: "Unauthorized" })

            const { name } = req.body

            if (!name || typeof name !== "string" || !name.trim()) {
                return res.status(400).json({ message: "Invalid name" })
            }

            const updated = await userModel.updateName(req.user.id, name.trim())

            if (!updated) return res.status(404).json({ message: "User not found" })

            const publicUser = {
                id: updated.id,
                name: updated.name,
                email: updated.email,
                role: updated.role,
            }

            return res.status(200).json({ user: publicUser })
        } catch (error) {
            next(error)
        }
    }
}