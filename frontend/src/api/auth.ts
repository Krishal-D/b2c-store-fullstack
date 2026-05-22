import { api } from "./client"
import type { AuthResponse } from "../types"

export async function login(
    email: string,
    password: string
): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", {
        email,
        password
    })

    return response.data
}

export async function register(
    name: string,
    email: string,
    password: string
): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register", {
        name,
        email,
        password
    })

    return response.data
}

export async function logout(): Promise<void> {
    await api.post("/auth/logout")
}