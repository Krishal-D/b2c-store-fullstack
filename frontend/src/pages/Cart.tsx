import { useEffect, useState } from "react"
import { Navbar } from "../components/layout/Navbar"
import { useAuth } from "../hooks/useAuth"
import { getCartItems } from "../api/cart"
import type { CartItem } from "../types"
import { useCart } from "../context/cartContext"

export function Cart() {
    const { token } = useAuth()
    const { setCartCount } = useCart()
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadCart() {
            if (!token) return

            try {
                const data = await getCartItems(token)
                setCartItems(data)

                const totalItems = data.reduce((sum, item) => {
                    return sum + item.quantity
                }, 0)

                setCartCount(totalItems)
            } finally {
                setLoading(false)
            }
        }

        loadCart()
    }, [token])

    return (
        <div className="min-h-screen bg-neutral-100">
            <Navbar />

            <main className="mx-auto max-w-7xl px-6 py-10">
                <h1 className="text-3xl font-bold">Your Cart</h1>

                {loading && (
                    <p className="mt-6 text-neutral-500">Loading cart...</p>
                )}

                {!loading && cartItems.length === 0 && (
                    <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-8 text-center">
                        <h2 className="text-xl font-semibold">Your cart is empty</h2>
                        <p className="mt-2 text-neutral-500">
                            Add products to your cart to see them here.
                        </p>
                    </div>
                )}

                <div className="mt-8 space-y-4">
                    {cartItems.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
                        >
                            <p className="font-semibold">Product ID: {item.product_id}</p>
                            <p className="text-sm text-neutral-500">
                                Quantity: {item.quantity}
                            </p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}