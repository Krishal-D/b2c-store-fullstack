import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Navbar } from "../components/layout/Navbar"
import { useAuth } from "../hooks/useAuth"
import { useCart } from "../context/cartContext"
import { mockCheckoutPayment } from "../api/payments"

export function Checkout() {
    const { token } = useAuth()
    const { setCartCount } = useCart()
    const navigate = useNavigate()

    const [cardName, setCardName] = useState("")
    const [cardNumber, setCardNumber] = useState("")
    const [expiry, setExpiry] = useState("")
    const [cvv, setCvv] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault()

        if (!token) {
            setMessage("Please login before checkout.")
            return
        }

        if (!cardName || !cardNumber || !expiry || !cvv) {
            setMessage("Please fill in all payment fields.")
            return
        }

        setLoading(true)
        setMessage("")

        try {
            await mockCheckoutPayment(token, {
                cardName,
                cardNumber,
                expiry,
                cvv
            })
            setCartCount(0)
            navigate("/orders")
        } catch {
            setMessage("Payment failed. Please check your cart and try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-neutral-100">
            <Navbar />

            <main className="mx-auto max-w-4xl px-6 py-10">
                <div className="rounded-3xl bg-white p-8 shadow-sm">
                    <p className="text-sm font-semibold text-emerald-600">
                        Mock Payment
                    </p>

                    <h1 className="mt-2 text-3xl font-bold">
                        Checkout
                    </h1>

                    <p className="mt-2 text-neutral-500">
                        Enter demo payment details to complete your order.
                    </p>

                    <div className="mt-5 rounded-xl bg-neutral-50 p-4 text-sm text-neutral-600">
                        Demo card: <strong>4242 4242 4242 4242</strong>
                    </div>

                    {message && (
                        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                            {message}
                        </p>
                    )}

                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Cardholder Name
                            </label>

                            <input
                                value={cardName}
                                onChange={(event) => setCardName(event.target.value)}
                                placeholder="Krishal Dhungana"
                                className="w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:border-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Card Number
                            </label>

                            <input
                                value={cardNumber}
                                onChange={(event) => setCardNumber(event.target.value)}
                                placeholder="4242 4242 4242 4242"
                                className="w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:border-emerald-500"
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Expiry Date
                                </label>

                                <input
                                    value={expiry}
                                    onChange={(event) => setExpiry(event.target.value)}
                                    placeholder="12/29"
                                    className="w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    CVV
                                </label>

                                <input
                                    value={cvv}
                                    onChange={(event) => setCvv(event.target.value)}
                                    placeholder="123"
                                    className="w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:border-emerald-500"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-emerald-500 px-5 py-3 font-medium text-white transition hover:bg-emerald-600 disabled:opacity-60"
                        >
                            {loading ? "Processing Payment..." : "Pay Now"}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    )
}