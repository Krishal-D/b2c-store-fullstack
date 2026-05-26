import { useState } from "react"
import { Button } from "../ui/Button"
import type { Product } from "../../types"
import { addToCart } from "../../api/cart"
import { useAuth } from "../../hooks/useAuth"
import { useCart } from "../../context/cartContext"
import { Link } from "react-router-dom"


interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {

    const { token } = useAuth()
    const { incrementCart } = useCart()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    async function handleAddToCart() {
        if (!token) {
            setMessage("Please sign in to add items to your cart.")
            return
        }

        setLoading(true)
        setMessage("")

        try {
            await addToCart(token, product.id, 1)
            incrementCart(1)
            setMessage("Added to cart successfully.")
        } catch {
            setMessage("Unable to add item to cart.")
        } finally {
            setLoading(false)
        }
    }
    return (
        <article
            className="
                group
                rounded-2xl
                border
                border-neutral-200
                bg-white
                p-4
                shadow-sm
                transition
                hover:-translate-y-1
                hover:shadow-lg
            "
        >
            <Link
                to={`/products/${product.id}`}
                className="block aspect-square rounded-xl bg-neutral-100 overflow-hidden"
            >                {product.image_url ? (
                <img
                    src={product.image_url}
                    alt={product.name}
                    className="
                            h-full
                            w-full
                            object-cover
                            transition
                            group-hover:scale-105
                        "
                />
            ) : (
                <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                    No image available
                </div>
            )}
            </Link>

            <div className="mt-4">
                <Link
                    to={`/products/${product.id}`}
                    className="font-semibold text-neutral-900 hover:text-emerald-600"
                >
                    {product.name}
                </Link>

                <p className="mt-1 text-sm text-neutral-500 line-clamp-2">
                    {product.description}
                </p>

                <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-bold">
                        ${product.price}
                    </span>

                    <span className="text-xs text-neutral-500">
                        Stock: {product.stock_quantity}
                    </span>
                </div>

                {message && (
                    <p
                        className={`mt-3 text-sm ${message.includes("successfully")
                            ? "text-emerald-600"
                            : "text-red-500"
                            }`}
                    >
                        {message}
                    </p>
                )}

                <Button
                    className="mt-4 w-full"
                    onClick={handleAddToCart}
                    disabled={loading || product.stock_quantity <= 0}
                >
                    {product.stock_quantity <= 0
                        ? "Out of Stock"
                        : loading
                            ? "Adding..."
                            : "Add to Cart"}
                </Button>
            </div>
        </article>
    )
}