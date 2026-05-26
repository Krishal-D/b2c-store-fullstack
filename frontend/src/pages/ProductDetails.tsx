import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Navbar } from "../components/layout/Navbar"
import { Button } from "../components/ui/Button"
import { getProductById } from "../api/products"
import { addToCart } from "../api/cart"
import { useAuth } from "../hooks/useAuth"
import { useCart } from "../context/cartContext"
import type { Product } from "../types"

export function ProductDetails() {
    const { id } = useParams()
    const { token } = useAuth()
    const { incrementCart } = useCart()

    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [adding, setAdding] = useState(false)
    const [message, setMessage] = useState("")

    useEffect(() => {
        async function loadProduct() {
            if (!id) return

            try {
                const data = await getProductById(Number(id))
                setProduct(data)
            } finally {
                setLoading(false)
            }
        }

        loadProduct()
    }, [id])

    async function handleAddToCart() {
        if (!token || !product) {
            setMessage("Please sign in to add items to your cart.")
            return
        }

        setAdding(true)
        setMessage("")

        try {
            await addToCart(token, product.id, 1)
            incrementCart(1)
            setMessage("Added to cart successfully.")
        } catch {
            setMessage("Unable to add item to cart.")
        } finally {
            setAdding(false)
        }
    }

    return (
        <div className="min-h-screen bg-neutral-100">
            <Navbar />

            <main className="mx-auto max-w-7xl px-6 py-10">
                <Link
                    to="/products"
                    className="text-sm font-medium text-emerald-600"
                >
                    ← Back to products
                </Link>

                {loading && (
                    <p className="mt-6 text-neutral-500">
                        Loading product...
                    </p>
                )}

                {!loading && !product && (
                    <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
                        <h1 className="text-2xl font-bold">
                            Product not found
                        </h1>
                    </div>
                )}

                {!loading && product && (
                    <section className="mt-8 grid gap-8 rounded-3xl bg-white p-6 shadow-sm md:grid-cols-2">
                        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-neutral-100">
                            {product.image_url ? (
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span className="text-neutral-400">
                                    No image available
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col justify-center">
                            <p className="text-sm font-semibold text-emerald-600">
                                Cartly Product
                            </p>

                            <h1 className="mt-3 text-4xl font-bold">
                                {product.name}
                            </h1>

                            <p className="mt-4 text-neutral-500">
                                {product.description}
                            </p>

                            <p className="mt-6 text-3xl font-bold">
                                ${Number(product.price).toFixed(2)}
                            </p>

                            <p className="mt-2 text-sm text-neutral-500">
                                Stock available: {product.stock_quantity}
                            </p>

                            {message && (
                                <p
                                    className={`mt-4 text-sm font-medium ${
                                        message.includes("successfully")
                                            ? "text-emerald-600"
                                            : "text-red-500"
                                    }`}
                                >
                                    {message}
                                </p>
                            )}

                            <Button
                                className="mt-6 w-full md:w-fit"
                                onClick={handleAddToCart}
                                disabled={
                                    adding ||
                                    product.stock_quantity <= 0
                                }
                            >
                                {product.stock_quantity <= 0
                                    ? "Out of Stock"
                                    : adding
                                      ? "Adding..."
                                      : "Add to Cart"}
                            </Button>
                        </div>
                    </section>
                )}
            </main>
        </div>
    )
}