export interface AppError extends Error {
    status?: number
}

export function httpError(message: string, status: number): AppError {
    return Object.assign(new Error(message), { status })
}

export function validationError(message: string): AppError {
    return httpError(message, 400)
}

export function parsePositiveInteger(value: unknown, fieldName: string): number {
    const parsed = Number(value)

    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw validationError(`${fieldName} must be a positive integer`)
    }

    return parsed
}
