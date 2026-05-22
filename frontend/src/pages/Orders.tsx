import { useEffect, useState } from "react"
import { Navbar } from "../components/layout/Navbar"
import { useAuth } from "../hooks/useAuth"
import { getOrders } from "../api/orders"
import type { Order } from "../types/order"
import { Link } from "react-router-dom"

export function Orders() {
    const { token } = useAuth()

    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadOrders() {
            if (!token) return

            try {
                const data = await getOrders(token)
                setOrders(data)
            } finally {
                setLoading(false)
            }
        }

        loadOrders()
    }, [token])

    return (
        <div className="min-h-screen bg-neutral-100">
            <Navbar />

            <main className="mx-auto max-w-7xl px-6 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">
                        Order History
                    </h1>

                    <p className="mt-2 text-neutral-500">
                        View all your previous purchases.
                    </p>
                </div>

                {loading && (
                    <p className="text-neutral-500">
                        Loading orders...
                    </p>
                )}

                {!loading && orders.length === 0 && (
                    <div className="rounded-2xl bg-white p-8 shadow-sm">
                        <h2 className="text-xl font-semibold">
                            No orders yet
                        </h2>

                        <p className="mt-2 text-neutral-500">
                            Orders you place will appear here.
                        </p>
                    </div>
                )}

                <div className="space-y-4">
                    {orders.map((order) => (
                        <Link
                            to={`/orders/${order.id}`}
                            key={order.id}
                            className="block rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-neutral-500">
                                        Order #{order.id}
                                    </p>

                                    <h2 className="mt-1 text-lg font-semibold">
                                        ${Number(order.total_amount).toFixed(2)}
                                    </h2>
                                </div>

                                <div
                                    className="
                                        rounded-full
                                        bg-emerald-100
                                        px-3
                                        py-1
                                        text-sm
                                        font-medium
                                        text-emerald-700
                                    "
                                >
                                    {order.status}
                                </div>
                            </div>

                            <p className="mt-4 text-sm text-neutral-500">
                                {new Date(
                                    order.created_at
                                ).toLocaleString()}
                            </p>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    )
}