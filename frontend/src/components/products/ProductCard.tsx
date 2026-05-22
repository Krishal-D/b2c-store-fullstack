import { Button } from "../ui/Button"
import type { Product } from "../../api/products"

interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
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
            <div className="aspect-square rounded-xl bg-neutral-100 overflow-hidden">
                {product.image_url ? (
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
            </div>

            <div className="mt-4">
                <h3 className="font-semibold text-neutral-900">
                    {product.name}
                </h3>

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

                <Button className="mt-4 w-full">
                    Add to Cart
                </Button>
            </div>
        </article>
    )
}