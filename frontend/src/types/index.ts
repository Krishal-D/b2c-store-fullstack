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
export interface Product {
    id: number
    name: string
    description: string
    price: string
    image_url: string | null
    stock_quantity: number
    category_id: number | null
    created_at: string
}