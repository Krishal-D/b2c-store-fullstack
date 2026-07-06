import { userModel } from "../models/userModel"
import {
    comparePassword,
    generateAccessToken,
    generateRefreshToken,
    hashPassword,
    verifyRefreshToken
} from "../config/auth"
import { TokenPayload } from "../types/authTypes"
import { httpError, validationError } from "../utils/httpError"

export const authService = {
    async register(name: unknown, email: unknown, password: unknown) {
        if (!name || typeof name !== "string" || !name.trim()) {
            throw validationError("Name is required")
        }

        if (!email || typeof email !== "string" || !email.trim()) {
            throw validationError("Email is required")
        }

        if (!password || typeof password !== "string" || !password.trim()) {
            throw validationError("Password is required")
        }

        const existing = await userModel.findUserByEmail(email.trim())

        if (existing) {
            throw httpError("Email already in use", 409)
        }

        const hashedPassword = await hashPassword(password)

        const user = await userModel.createUser(
            name.trim(),
            email.trim(),
            hashedPassword
        )

        const payload: TokenPayload = {
            id: user.id,
            email: user.email,
            role: user.role
        }

        const refreshToken = generateRefreshToken(payload)
        const accessToken = generateAccessToken(payload)

        await userModel.updateRefreshToken(user.id, refreshToken)

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            refreshToken,
            accessToken
        }
    },

    async login(email: unknown, password: unknown) {
        if (!email || typeof email !== "string" || !email.trim()) {
            throw validationError("Email is required")
        }

        if (!password || typeof password !== "string") {
            throw validationError("Password is required")
        }

        const user = await userModel.findUserByEmail(email.trim())

        if (!user || !user.password) {
            throw httpError("Invalid credentials", 401)
        }

        const passwordMatch = await comparePassword(password, user.password)

        if (!passwordMatch) {
            throw httpError("Invalid credentials", 401)
        }

        const payload: TokenPayload = {
            id: user.id,
            email: user.email,
            role: user.role
        }

        const refreshToken = generateRefreshToken(payload)
        const accessToken = generateAccessToken(payload)

        await userModel.updateRefreshToken(user.id, refreshToken)

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            refreshToken,
            accessToken
        }
    },

    async logout(token: unknown): Promise<void> {
        if (!token || typeof token !== "string") {
            throw validationError("Refresh token is required")
        }

        const user = verifyRefreshToken(token)

        if (user?.id) {
            await userModel.removeRefreshToken(user.id)
        }
    },

    async refresh(token: unknown) {
        if (!token || typeof token !== "string") {
            throw httpError("Refresh token is required", 401)
        }

        const tokenUser = verifyRefreshToken(token)

        if (!tokenUser) {
            throw httpError("Invalid token", 401)
        }

        const storedUser = await userModel.findUserById(tokenUser.id)

        if (!storedUser || storedUser.refresh_token !== token) {
            throw httpError("Invalid token", 401)
        }

        const payload: TokenPayload = {
            id: storedUser.id,
            email: storedUser.email,
            role: storedUser.role
        }

        const newRefreshToken = generateRefreshToken(payload)
        const newAccessToken = generateAccessToken(payload)

        await userModel.updateRefreshToken(payload.id, newRefreshToken)

        return {
            newAccessToken,
            newRefreshToken,
            user: payload
        }
    }
}