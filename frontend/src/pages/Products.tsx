import { Navbar } from "../components/layout/Navbar"
import { useProducts } from "../hooks/useProducts"
import { Button } from "../components/ui/Button"
import { ProductCard } from "../components/products/ProductCard"

export function Products() {
    const { products, loading, error } = useProducts()

    return (
        <div className="min-h-screen bg-neutral-100">
            <Navbar />

            <main className="mx-auto max-w-7xl px-6 py-8">
                <section className="rounded-3xl bg-[#0A0A0A] px-8 py-14 text-white">
                    <p className="text-sm font-semibold text-emerald-400">
                        Cartly Collection
                    </p>

                    <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight md:text-5xl">
                        Discover essentials made for everyday living.
                    </h1>

                    <p className="mt-4 max-w-xl text-neutral-300">
                        Browse curated products, compare prices, and add your favourites to cart.
                    </p>
                </section>

                <section className="mt-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Products</h2>
                        <p className="text-sm text-neutral-500">
                            Showing available products
                        </p>
                    </div>
                </section>

                {loading && (
                    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-72 animate-pulse rounded-2xl bg-white"
                            />
                        ))}
                    </div>
                )}

                {error && (
                    <p className="mt-8 rounded-xl bg-red-50 p-4 text-sm text-red-600">
                        {error}
                    </p>
                )}

                {!loading && !error && (
                    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}