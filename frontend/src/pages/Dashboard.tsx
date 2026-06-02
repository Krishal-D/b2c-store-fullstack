import { useEffect, useState } from "react"
import { Navbar } from "../components/layout/Navbar"
import { useAuth } from "../hooks/useAuth"
import { getUserOrders } from "../api/orders"
import type { Order } from "../types/order"

export function Dashboard() {
    const { token } = useAuth()

    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadData() {
            if (!token) return

            try {
                const data = await getUserOrders(token)
                setOrders(data)
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [token])

    const totalOrders = orders.length

    const totalSpent = orders.reduce((sum, order) => {
        return sum + Number(order.total_amount)
    }, 0)

    const recentOrders = orders.slice(0, 3)

    return (
        <div className="min-h-screen bg-neutral-100">
            <Navbar />

            <main className="mx-auto max-w-7xl px-6 py-10">
                <h1 className="text-3xl font-bold">Dashboard</h1>

                {loading && (
                    <p className="mt-6 text-neutral-500">Loading...</p>
                )}

                {!loading && (
                    <>
                        {/* Stats */}
                        <div className="mt-8 grid gap-6 md:grid-cols-2">
                            <div className="rounded-2xl bg-white p-6 shadow-sm">
                                <p className="text-sm text-neutral-500">
                                    Total Orders
                                </p>
                                <h2 className="mt-2 text-3xl font-bold">
                                    {totalOrders}
                                </h2>
                            </div>

                            <div className="rounded-2xl bg-white p-6 shadow-sm">
                                <p className="text-sm text-neutral-500">
                                    Total Spent
                                </p>
                                <h2 className="mt-2 text-3xl font-bold">
                                    ${totalSpent.toFixed(2)}
                                </h2>
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className="mt-10 rounded-2xl bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-semibold">
                                Recent Orders
                            </h2>

                            {recentOrders.length === 0 && (
                                <p className="mt-4 text-sm text-neutral-500">
                                    No orders yet.
                                </p>
                            )}

                            <div className="mt-4 space-y-3">
                                {recentOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between rounded-xl border p-4"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                Order #{order.id}
                                            </p>
                                            <p className="text-sm text-neutral-500">
                                                {new Date(
                                                    order.created_at
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p className="font-semibold">
                                                ${Number(order.total_amount).toFixed(2)}
                                            </p>

                                            <span
                                                className={`
                                                    text-xs font-medium px-2 py-1 rounded
                                                    ${
                                                        order.status === "paid"
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : "bg-yellow-100 text-yellow-700"
                                                    }
                                                `}
                                            >
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    )
}