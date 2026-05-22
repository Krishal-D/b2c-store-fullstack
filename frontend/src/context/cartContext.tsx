import {
    createContext,
    useContext,
    useState,
    type ReactNode
} from "react"
import type { CartContextType } from "../types/cart"
import { useEffect } from "react"

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartCount, setCartCount] = useState(() => {
        const saved = localStorage.getItem("cartCount")

        return saved ? Number(saved) : 0
    })

    useEffect(() => {
        localStorage.setItem("cartCount", String(cartCount))
    }, [cartCount])
    
    function incrementCart(quantity = 1) {
        setCartCount((prev) => prev + quantity)
    }

    return (
        <CartContext.Provider
            value={{
                cartCount,
                setCartCount,
                incrementCart
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)

    if (!context) {
        throw new Error("useCart must be used within CartProvider")
    }

    return context
}