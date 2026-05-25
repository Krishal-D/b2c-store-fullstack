import { useEffect, useState } from "react"
import { Navbar } from "../components/layout/Navbar"
import { useAuth } from "../hooks/useAuth"
import { useCart } from "../context/cartContext"
import { getCartItems, deleteCartItem, updateCartItem } from "../api/cart"
import type { CartItem } from "../types/cart"
import { checkout } from "../api/orders"
import {  useNavigate } from "react-router-dom"


export function Cart() {
    const { token } = useAuth()
    const { setCartCount } = useCart()

    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [loading, setLoading] = useState(true)
    const [checkoutLoading, setCheckoutLoading] = useState(false)
    const [message, setMessage] = useState("")
    const navigate = useNavigate()

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
    }, [token, setCartCount])

    const total = cartItems.reduce((sum, item) => {
        return sum + Number(item.price) * item.quantity
    }, 0)

    async function handleCheckout() {
        if (!token) {
            setMessage("Please sign in before checkout.")
            return
        }

        setCheckoutLoading(true)
        setMessage("")

        try {
            await checkout(token)
            setCartItems([])
            setCartCount(0)
            navigate("/orders")
        } catch {
            setMessage("Checkout failed. Please check your cart and try again.")
        } finally {
            setCheckoutLoading(false)
        }
    }
    async function handleRemoveItem(cartItemId: number) {
        if (!token) return

        try {
            await deleteCartItem(token, cartItemId)

            const updatedItems = cartItems.filter(
                item => item.id !== cartItemId
            )

            setCartItems(updatedItems)

            const totalItems = updatedItems.reduce(
                (sum, item) => sum + item.quantity,
                0
            )

            setCartCount(totalItems)
        } catch {
            setMessage("Failed to remove item.")
        }
    }

    async function handleQuantityChange(
        cartItemId: number,
        newQuantity: number
    ) {
        if (!token) return

        if (newQuantity < 1) {
            await handleRemoveItem(cartItemId)
            return
        }

        try {
            const response = await updateCartItem(
                token,
                cartItemId,
                newQuantity
            )

            const updatedItems = cartItems.map((item) => {
                if (item.id === cartItemId) {
                    return {
                        ...item,
                        quantity: response.cartItem.quantity
                    }
                }

                return item
            })

            setCartItems(updatedItems)

            const totalItems = updatedItems.reduce(
                (sum, item) => sum + item.quantity,
                0
            )

            setCartCount(totalItems)
        } catch {
            setMessage("Failed to update quantity.")
        }
    }
    return (
        <div className="min-h-screen bg-neutral-100">
            <Navbar />

            <main className="mx-auto max-w-7xl px-6 py-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Your Cart</h1>
                        <p className="mt-1 text-sm text-neutral-500">
                            Review your selected products before checkout.
                        </p>
                    </div>
                </div>

                {loading && (
                    <p className="mt-6 text-neutral-500">Loading cart...</p>
                )}

                {!loading && cartItems.length === 0 && (
                    <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-8 text-center">
                        <h2 className="text-xl font-semibold">
                            Your cart is empty
                        </h2>

                        <p className="mt-2 text-neutral-500">
                            Add products to your cart to see them here.
                        </p>
                    </div>
                )}

                {!loading && cartItems.length > 0 && (
                    <>
                        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-neutral-500">
                                        Cart Summary
                                    </p>

                                    <h2 className="mt-1 text-3xl font-bold">
                                        ${total.toFixed(2)}
                                    </h2>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={checkoutLoading}
                                    className="
                                            rounded-xl
                                            bg-emerald-500
                                            px-6
                                            py-3
                                            font-medium
                                            text-white
                                            transition
                                            hover:bg-emerald-600
                                            disabled:cursor-not-allowed
                                            disabled:opacity-60
                                        "
                                >
                                    {checkoutLoading ? "Processing..." : "Proceed to Checkout"}
                                </button>
                            </div>
                        </div>
                        {message && (
                            <p
                                className={`mt-4 text-sm font-medium ${message.includes("successfully")
                                    ? "text-emerald-600"
                                    : "text-red-500"
                                    }`}
                            >
                                {message}
                            </p>
                        )}

                        <div className="mt-8 space-y-4">
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
                                >
                                    <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl bg-neutral-100">
                                        {item.image_url ? (
                                            <img
                                                src={item.image_url}
                                                alt={item.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-xs text-neutral-400">
                                                No Image
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-1 items-center justify-between gap-4">
                                        <div>
                                            <h2 className="text-lg font-semibold">
                                                {item.name}
                                            </h2>

                                            <p className="mt-1 text-sm text-neutral-500">
                                                {item.description}
                                            </p>

                                            <p className="mt-2 text-sm font-medium text-neutral-700">
                                                ${Number(item.price).toFixed(2)} each
                                            </p>

                                            <div className="mt-3 flex items-center gap-3">
                                                <button
                                                    onClick={() =>
                                                        handleQuantityChange(item.id, item.quantity - 1)
                                                    }
                                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 font-bold hover:bg-neutral-200"
                                                >
                                                    -
                                                </button>

                                                <span className="text-sm font-medium">
                                                    Qty {item.quantity}
                                                </span>

                                                <button
                                                    onClick={() =>
                                                        handleQuantityChange(item.id, item.quantity + 1)
                                                    }
                                                    disabled={item.quantity >= item.stock_quantity}
                                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 font-bold hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="
                                                                mt-3
                                                                block
                                                                text-sm
                                                                font-medium
                                                                text-red-500
                                                                hover:text-red-600
                                                            "
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        <p className="text-xl font-bold">
                                            $
                                            {(
                                                Number(item.price) *
                                                item.quantity
                                            ).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </>
                )}
            </main>
        </div>
    )
}