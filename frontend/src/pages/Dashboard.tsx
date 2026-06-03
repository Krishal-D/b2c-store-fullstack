import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Navbar } from "../components/layout/Navbar"
import { useAuth } from "../hooks/useAuth"
import { getUserOrders, getAllOrders } from "../api/orders"
import { getProducts } from "../api/products"
import type { Order } from "../types/order"
import type { Product } from "../types"

export function Dashboard() {
    const { token, user } = useAuth()
    const isAdmin = user?.role === "admin"

    const [orders, setOrders] = useState<Order[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadData() {
            if (!token) return

            try {
                if (isAdmin) {
                    const [adminOrders, productList] = await Promise.all([
                        getAllOrders(token),
                        getProducts()
                    ])
                    setOrders(adminOrders)
                    setProducts(productList)
                } else {
                    const data = await getUserOrders(token)
                    setOrders(data)
                }
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [token, isAdmin])

    const totalOrders = orders.length

    const totalAmount = orders.reduce((sum, order) => {
        return sum + Number(order.total_amount)
    }, 0)

    const totalSpent = !isAdmin ? totalAmount : 0
    const totalRevenue = isAdmin ? totalAmount : 0

    const pendingOrders = orders.filter(
        (order) => order.status === "pending"
    ).length

    const paidOrders = orders.filter(
        (order) => order.status === "paid"
    ).length

    const averageOrderValue = totalOrders
        ? totalAmount / totalOrders
        : 0

    const totalProducts = products.length
    const recentOrders = orders.slice(0, 3)

    return (
        <div className="min-h-screen bg-neutral-100">
            <Navbar />

            <main className="mx-auto max-w-7xl px-6 py-10">
                {loading ? (
                    <p className="mt-6 text-neutral-500">Loading...</p>
                ) : isAdmin ? (
                    <>
                        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">
                                    Shopkeeper dashboard
                                </p>

                                <h1 className="mt-3 text-3xl font-bold text-slate-900">
                                    Hello{user?.name ? `, ${user.name}` : ""}
                                </h1>

                                <p className="mt-2 text-sm text-neutral-500 max-w-2xl">
                                    Manage products, orders, and site performance from one place.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                <div className="rounded-3xl bg-white p-5 shadow-sm">
                                    <p className="text-sm text-neutral-500">Total Orders</p>
                                    <p className="mt-3 text-3xl font-bold">{totalOrders}</p>
                                </div>

                                <div className="rounded-3xl bg-white p-5 shadow-sm">
                                    <p className="text-sm text-neutral-500">Total Products</p>
                                    <p className="mt-3 text-3xl font-bold">{totalProducts}</p>
                                </div>

                                <div className="rounded-3xl bg-white p-5 shadow-sm">
                                    <p className="text-sm text-neutral-500">Pending Orders</p>
                                    <p className="mt-3 text-3xl font-bold text-yellow-700">
                                        {pendingOrders}
                                    </p>
                                </div>

                                <div className="rounded-3xl bg-white p-5 shadow-sm">
                                    <p className="text-sm text-neutral-500">Revenue</p>
                                    <p className="mt-3 text-3xl font-bold text-emerald-700">
                                        ${totalRevenue.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
                            <section className="space-y-6">
                                <div className="rounded-3xl bg-white p-6 shadow-sm">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-semibold text-neutral-500">
                                                Shopkeeper action center
                                            </p>
                                            <h2 className="mt-3 text-xl font-bold text-slate-900">
                                                Quick links
                                            </h2>
                                        </div>

                                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                                            Shopkeeper access
                                        </span>
                                    </div>

                                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                        <Link
                                            to="/admin/products"
                                            className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 transition hover:border-emerald-300 hover:bg-white"
                                        >
                                            <p className="text-sm text-neutral-500">Manage products</p>
                                            <p className="mt-3 text-2xl font-semibold text-slate-900">
                                                {totalProducts}
                                            </p>
                                        </Link>

                                        <Link
                                            to="/admin/orders"
                                            className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 transition hover:border-emerald-300 hover:bg-white"
                                        >
                                            <p className="text-sm text-neutral-500">Review orders</p>
                                            <p className="mt-3 text-2xl font-semibold text-slate-900">
                                                {totalOrders}
                                            </p>
                                        </Link>
                                    </div>

                                    <div className="mt-6 rounded-2xl bg-neutral-100 p-4">
                                        <p className="text-sm text-neutral-500">Current dashboard snapshot</p>
                                        <div className="mt-3 grid gap-3 sm:grid-cols-3">
                                            <div className="rounded-2xl bg-white p-4">
                                                <p className="text-sm text-neutral-500">Active products</p>
                                                <p className="mt-2 text-lg font-semibold text-slate-900">{totalProducts}</p>
                                            </div>

                                            <div className="rounded-2xl bg-white p-4">
                                                <p className="text-sm text-neutral-500">Open orders</p>
                                                <p className="mt-2 text-lg font-semibold text-yellow-700">{pendingOrders}</p>
                                            </div>

                                            <div className="rounded-2xl bg-white p-4">
                                                <p className="text-sm text-neutral-500">Revenue</p>
                                                <p className="mt-2 text-lg font-semibold text-emerald-700">${totalRevenue.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-3xl bg-white p-6 shadow-sm">
                                    <h2 className="text-xl font-semibold text-slate-900">
                                        Recent orders
                                    </h2>

                                    {recentOrders.length === 0 ? (
                                        <p className="mt-4 text-sm text-neutral-500">
                                            No recent orders yet.
                                        </p>
                                    ) : (
                                        <div className="mt-4 space-y-4">
                                            {recentOrders.map((order) => (
                                                <div
                                                    key={order.id}
                                                    className="rounded-2xl border border-neutral-200 p-4"
                                                >
                                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                        <div>
                                                            <p className="text-sm text-neutral-500">
                                                                CT{String(order.id).padStart(3, "0")}
                                                            </p>
                                                            <p className="mt-1 text-base font-semibold text-slate-900">
                                                                ${Number(order.total_amount).toFixed(2)}
                                                            </p>
                                                        </div>

                                                        <span className={`rounded-full px-3 py-1 text-sm font-medium ${order.status === "pending"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-emerald-100 text-emerald-700"
                                                        }`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <p className="mt-3 text-sm text-neutral-500">
                                                        {new Date(order.created_at).toLocaleString()}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </section>

                            <aside className="space-y-6">
                                <div className="rounded-3xl bg-white p-6 shadow-sm">
                                    <h2 className="text-xl font-semibold text-slate-900">
                                        Insights
                                    </h2>
                                    <p className="mt-3 text-sm text-neutral-500">
                                        Track delivery status, top products, and store health from the shopkeeper view.
                                    </p>

                                    <div className="mt-6 space-y-4">
                                        <div className="rounded-2xl bg-neutral-50 p-4">
                                            <p className="text-sm text-neutral-500">Paid order share</p>
                                            <p className="mt-2 text-2xl font-semibold text-emerald-700">
                                                {totalOrders ? ((paidOrders / totalOrders) * 100).toFixed(0) : 0}%
                                            </p>
                                        </div>

                                        <div className="rounded-2xl bg-neutral-50 p-4">
                                            <p className="text-sm text-neutral-500">Average order value</p>
                                            <p className="mt-2 text-2xl font-semibold text-slate-900">
                                                ${averageOrderValue.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">
                                    Buyer dashboard
                                </p>

                                <h1 className="mt-3 text-3xl font-bold text-slate-900">
                                    Welcome back{user?.name ? `, ${user.name}` : ""}
                                </h1>

                                <p className="mt-2 text-sm text-neutral-500 max-w-2xl">
                                    A quick overview of your orders and recent shopping activity.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                <div className="rounded-3xl bg-white p-5 shadow-sm">
                                    <p className="text-sm text-neutral-500">Orders</p>
                                    <p className="mt-3 text-3xl font-bold">{totalOrders}</p>
                                </div>

                                <div className="rounded-3xl bg-white p-5 shadow-sm">
                                    <p className="text-sm text-neutral-500">Completed</p>
                                    <p className="mt-3 text-3xl font-bold text-emerald-700">
                                        {paidOrders}
                                    </p>
                                </div>

                                <div className="rounded-3xl bg-white p-5 shadow-sm">
                                    <p className="text-sm text-neutral-500">Pending</p>
                                    <p className="mt-3 text-3xl font-bold text-yellow-700">
                                        {pendingOrders}
                                    </p>
                                </div>

                                <div className="rounded-3xl bg-white p-5 shadow-sm">
                                    <p className="text-sm text-neutral-500">Spent</p>
                                    <p className="mt-3 text-3xl font-bold text-slate-900">
                                        ${totalSpent.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
                            <section className="space-y-6">
                                <div className="rounded-3xl bg-white p-6 shadow-sm">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-semibold text-neutral-500">
                                                Order activity
                                            </p>
                                            <h2 className="mt-3 text-xl font-bold text-slate-900">
                                                Orders by status
                                            </h2>
                                        </div>

                                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                                            Updated now
                                        </span>
                                    </div>

                                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                        <div className="rounded-2xl bg-neutral-50 p-5">
                                            <p className="text-sm text-neutral-500">Paid orders</p>
                                            <p className="mt-2 text-3xl font-semibold text-emerald-700">
                                                {paidOrders}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl bg-neutral-50 p-5">
                                            <p className="text-sm text-neutral-500">Pending orders</p>
                                            <p className="mt-2 text-3xl font-semibold text-yellow-700">
                                                {pendingOrders}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 rounded-2xl bg-neutral-100 p-4">
                                        <p className="text-sm text-neutral-500">Completion rate</p>
                                        <div className="mt-3 h-3 overflow-hidden rounded-full bg-white">
                                            <div
                                                className="h-full rounded-full bg-emerald-500"
                                                style={{ width: `${Math.min(100, totalOrders ? (paidOrders / totalOrders) * 100 : 0)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-3xl bg-white p-6 shadow-sm">
                                    <h2 className="text-xl font-semibold text-slate-900">
                                        Recent orders
                                    </h2>

                                    {recentOrders.length === 0 ? (
                                        <p className="mt-4 text-sm text-neutral-500">
                                            No recent orders yet.
                                        </p>
                                    ) : (
                                        <div className="mt-4 space-y-4">
                                            {recentOrders.map((order) => (
                                                <div
                                                    key={order.id}
                                                    className="rounded-2xl border border-neutral-200 p-4"
                                                >
                                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                        <div>
                                                            <p className="text-sm text-neutral-500">
                                                                CT{String(order.id).padStart(3, "0")}
                                                            </p>
                                                            <p className="mt-1 text-base font-semibold text-slate-900">
                                                                ${Number(order.total_amount).toFixed(2)}
                                                            </p>
                                                        </div>

                                                        <span className={`rounded-full px-3 py-1 text-sm font-medium ${order.status === "pending"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-emerald-100 text-emerald-700"
                                                        }`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <p className="mt-3 text-sm text-neutral-500">
                                                        {new Date(order.created_at).toLocaleString()}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </section>

                            <aside className="space-y-6">
                                <div className="rounded-3xl bg-white p-6 shadow-sm">
                                    <h2 className="text-xl font-semibold text-slate-900">
                                        Shopping insights
                                    </h2>
                                    <p className="mt-3 text-sm text-neutral-500">
                                        Track your order progress and see what’s happening with your latest purchases.
                                    </p>

                                    <div className="mt-6 space-y-4">
                                        <div className="rounded-2xl bg-neutral-50 p-4">
                                            <p className="text-sm text-neutral-500">Paid order share</p>
                                            <p className="mt-2 text-2xl font-semibold text-emerald-700">
                                                {totalOrders ? ((paidOrders / totalOrders) * 100).toFixed(0) : 0}%
                                            </p>
                                        </div>

                                        <div className="rounded-2xl bg-neutral-50 p-4">
                                            <p className="text-sm text-neutral-500">Average order value</p>
                                            <p className="mt-2 text-2xl font-semibold text-slate-900">
                                                ${averageOrderValue.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </>
                )}
            </main>
        </div>
    )
}