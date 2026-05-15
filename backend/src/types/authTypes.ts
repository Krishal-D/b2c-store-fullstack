export interface RegisterInput {
    name: string
    email: string
    password: string
}

export interface LoginInput {
    email: string
    password: string
}

export interface User {
    id: number
    name: string
    email: string
    password: string
    role: "user" | "admin"
    refresh_token?: string | null
    created_at: Date
}

export interface TokenPayload {
    id: number
    email: string
    role: "user" | "admin"
}