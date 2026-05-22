import { createContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "../types"
import * as authAPI from "../api/auth"
import { refresh } from "../api/auth"

interface AuthContextType {
    user: User | null
    token: string | null
    loading: boolean
    login: (email: string, password: string) => Promise<void>
    register: (name: string, email: string, password: string) => Promise<void>
    logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function restoreSession() {
            try {
                const data = await refresh()
                setUser(data.user)
                setToken(data.token)
            } catch {
                setUser(null)
                setToken(null)
            } finally {
                setLoading(false)
            }
        }

        restoreSession()
    }, [])

    async function login(email: string, password: string) {
        setLoading(true)

        try {
            const data = await authAPI.login(email, password)
            setUser(data.user)
            setToken(data.token)
        } finally {
            setLoading(false)
        }
    }

    async function register(name: string, email: string, password: string) {
        setLoading(true)

        try {
            const data = await authAPI.register(name, email, password)
            setUser(data.user)
            setToken(data.token)
        } finally {
            setLoading(false)
        }
    }

    async function logout() {
        await authAPI.logout()
        setUser(null)
        setToken(null)
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                register,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}