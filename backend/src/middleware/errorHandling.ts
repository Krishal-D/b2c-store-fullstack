import type { Request, Response, NextFunction } from "express"
import type { AppError } from "../utils/httpError"

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