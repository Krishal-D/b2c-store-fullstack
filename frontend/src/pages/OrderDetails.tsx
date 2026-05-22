import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Navbar } from "../components/layout/Navbar"
import { useAuth } from "../hooks/useAuth"
import { getOrderItems } from "../api/orders"
import type { OrderItem } from "../types/order"

export function OrderDetails() {
    const { id } = useParams()
    const { token } = useAuth()

    const [items, setItems] = useState<OrderItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadOrderItems() {
            if (!token || !id) return

            try {
                const data = await getOrderItems(token, Number(id))
                setItems(data)
            } finally {
                setLoading(false)
            }
        }

        loadOrderItems()
    }, [token, id])

    const total = items.reduce((sum, item) => {
        return sum + Number(item.price) * item.quantity
    }, 0)

    return (
        <div className="min-h-screen bg-neutral-100">
            <Navbar />

            <main className="mx-auto max-w-7xl px-6 py-10">
                <Link
                    to="/orders"
                    className="text-sm font-medium text-emerald-600"
                >
                    ← Back to orders
                </Link>

                <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
                    <p className="text-sm text-neutral-500">
                        Order #{id}
                    </p>

                    <h1 className="mt-1 text-3xl font-bold">
                        Order Details
                    </h1>

                    <p className="mt-2 text-neutral-500">
                        Items included in this purchase.
                    </p>
                </div>

                {loading && (
                    <p className="mt-6 text-neutral-500">
                        Loading order items...
                    </p>
                )}

                {!loading && (
                    <>
                        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-medium">
                                    Order Total
                                </span>

                                <span className="text-2xl font-bold">
                                    ${total.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <div className="mt-8 space-y-4">
                            {items.map((item) => (
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

                                            <div className="mt-3 inline-flex rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium">
                                                Qty {item.quantity}
                                            </div>
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