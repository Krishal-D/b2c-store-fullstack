import type { Request, Response, NextFunction } from "express"

interface AppError extends Error {
    status?: number
}

export const errorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {

    const status = err.status ?? 500
    const message = err.message || "Internal server error"

    res.status(status).json({ message })
}