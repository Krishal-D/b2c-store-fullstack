export interface User {
    id: number
    name: string
    email: string
    role: "user" | "admin"
}

export interface AuthResponse {
    token: string
    user: User
    message: string
}

export interface LoginFormData {
    email: string
    password: string
}

export interface RegisterFormData {
    name: string
    email: string
    password: string
}