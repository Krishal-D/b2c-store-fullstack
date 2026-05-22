import { Navbar } from "../components/layout/Navbar"
import { useAuth } from "../hooks/useAuth"

export function Dashboard() {
    const { user, logout } = useAuth()

    return (
        <div className="min-h-screen bg-neutral-100">
            <Navbar />

            <main className="mx-auto max-w-7xl px-6 py-10">
                <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
                    <p className="text-sm font-semibold text-emerald-600">
                        Cartly Dashboard
                    </p>

                    <h1 className="mt-2 text-3xl font-bold">
                        Welcome back, {user?.name}
                    </h1>

                    <p className="mt-2 text-neutral-500">
                        Browse products, manage your cart, and track your orders.
                    </p>

                    <button
                        onClick={logout}
                        className="mt-6 rounded-xl bg-[#0A0A0A] px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
                    >
                        Logout
                    </button>
                </div>
            </main>
        </div>
    )
}