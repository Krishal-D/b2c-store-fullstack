import { Navbar } from "../components/layout/Navbar"

export function Orders() {
    return (
        <div className="min-h-screen bg-neutral-100">
            <Navbar />

            <main className="mx-auto max-w-7xl px-6 py-10">
                <div className="rounded-2xl bg-white p-8 shadow-sm">
                    <p className="text-sm font-semibold text-emerald-600">
                        Order placed
                    </p>

                    <h1 className="mt-2 text-3xl font-bold">
                        Thank you for your purchase.
                    </h1>

                    <p className="mt-2 text-neutral-500">
                        Your order has been created successfully.
                    </p>
                </div>
            </main>
        </div>
    )
}