import { useEffect, useState } from "react"
import { Navbar } from "../components/layout/Navbar"
import { useProducts } from "../hooks/useProducts"
import { ProductCard } from "../components/products/ProductCard"
import { getCategories } from "../api/categories"
import type { Category } from "../types"

export function Products() {
    const { products, loading, error } = useProducts()

    const [search, setSearch] = useState("")
    const [selectedCategoryId, setSelectedCategoryId] = useState("all")
    const [categories, setCategories] = useState<Category[]>([])

    useEffect(() => {
        async function loadCategories() {
            try {
                const data = await getCategories()
                setCategories(data)
            } catch {
                setCategories([])
            }
        }

        loadCategories()
    }, [])

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name
            .toLowerCase()
            .includes(search.toLowerCase())

        const matchesCategory =
            selectedCategoryId === "all" ||
            product.category_id === Number(selectedCategoryId)

        return matchesSearch && matchesCategory
    })

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

                <section className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Products</h2>
                        <p className="text-sm text-neutral-500">
                            Showing {filteredProducts.length} available products
                        </p>
                    </div>

                    <div className="flex w-full flex-col gap-3 md:max-w-xl md:flex-row">
                        <input
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search products..."
                            className="
                                w-full
                                rounded-xl
                                border
                                border-neutral-200
                                bg-white
                                px-4
                                py-3
                                text-sm
                                outline-none
                                focus:border-emerald-500
                            "
                        />

                        <select
                            value={selectedCategoryId}
                            onChange={(event) =>
                                setSelectedCategoryId(event.target.value)
                            }
                            className="
                                rounded-xl
                                border
                                border-neutral-200
                                bg-white
                                px-4
                                py-3
                                text-sm
                                outline-none
                                focus:border-emerald-500
                            "
                        >
                            <option value="all">All categories</option>

                            {categories.map((category) => (
                                <option
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </option>
                            ))}
                        </select>
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

                {!loading && !error && filteredProducts.length === 0 && (
                    <div className="mt-8 rounded-2xl bg-white p-8 text-center shadow-sm">
                        <h3 className="text-xl font-semibold">
                            No products found
                        </h3>

                        <p className="mt-2 text-neutral-500">
                            Try changing your search or category filter.
                        </p>
                    </div>
                )}

                {!loading && !error && filteredProducts.length > 0 && (
                    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredProducts.map((product) => (
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