import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Navbar } from "../components/layout/Navbar"
import { useAuth } from "../hooks/useAuth"
import { getAllOrders } from "../api/orders"
import type { Order } from "../types/order"

export function AdminOrders() {
    const { token } = useAuth()

    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadOrders() {
            if (!token) return

            try {
                const data = await getAllOrders(token)
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
                    <p className="text-sm font-semibold text-emerald-600">
                        Admin Panel
                    </p>

                    <h1 className="mt-2 text-3xl font-bold">
                        Order Management
                    </h1>

                    <p className="mt-2 text-neutral-500">
                        View customer purchase records.
                    </p>
                </div>

                {loading ? (
                    <p className="text-neutral-500">
                        Loading orders...
                    </p>
                ) : (
                    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
                        <table className="w-full min-w-[720px]">
                            <thead>
                                <tr className="border-b bg-neutral-50">
                                    <th className="p-4 text-left text-sm font-semibold">
                                        Order
                                    </th>

                                    <th className="p-4 text-left text-sm font-semibold">
                                        User ID
                                    </th>

                                    <th className="p-4 text-left text-sm font-semibold">
                                        Total
                                    </th>

                                    <th className="p-4 text-left text-sm font-semibold">
                                        Status
                                    </th>

                                    <th className="p-4 text-left text-sm font-semibold">
                                        Date
                                    </th>

                                    <th className="p-4 text-right text-sm font-semibold">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {orders.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="border-b last:border-b-0"
                                    >
                                        <td className="p-4 font-medium">
                                            CT{String(order.id).padStart(3, "0")}
                                        </td>

                                        <td className="p-4 text-sm text-neutral-600">
                                            {order.user_id}
                                        </td>

                                        <td className="p-4 font-medium">
                                            ${Number(order.total_amount).toFixed(2)}
                                        </td>

                                        <td className="p-4">
                                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                                                {order.status}
                                            </span>
                                        </td>

                                        <td className="p-4 text-sm text-neutral-600">
                                            {new Date(order.created_at).toLocaleString()}
                                        </td>

                                        <td className="p-4 text-right">
                                            <Link
                                                to={`/orders/${order.id}`}
                                                className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    )
}