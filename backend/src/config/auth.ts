import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { TokenPayload } from "../types/authTypes"

dotenv.config()

const JWT_SECRET: string = process.env.JWT_SECRET!
const JWT_REFRESH_SECRET: string = process.env.JWT_REFRESH_SECRET!
const SALT_ROUNDS = 12

export const generateAccessToken = (user: TokenPayload): string => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        JWT_SECRET,
        { expiresIn: "15m" }
    )
}

export const generateRefreshToken = (user: TokenPayload): string => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
    )
}

export const verifyAccessToken = (token: string): TokenPayload | null => {
    try {
        return jwt.verify(token, JWT_SECRET) as TokenPayload
    } catch (error) {
        console.error("Access token verification failed:", error)
        return null
    }
}

export const verifyRefreshToken = (token: string): TokenPayload | null => {
    try {
        return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload
    } catch (error) {
        console.error("Refresh token verification failed:", error)
        return null
    }
}

export const hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, SALT_ROUNDS)
}

export const comparePassword = async (
    password: string,
    hashedPassword: string
): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword)
}