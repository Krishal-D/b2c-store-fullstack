import type { Request, Response, NextFunction } from "express"

export const authorizeAdmin = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({
            message: "Admin access required"
        })
    }

    next()
}