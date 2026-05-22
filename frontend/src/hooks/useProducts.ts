import { useEffect, useState } from "react"
import { getProducts} from "../api/products"
import type { Product } from "../types"
export function useProducts() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function loadProducts() {
            try {
                const data = await getProducts()
                setProducts(data)
            } catch {
                setError("Failed to load products")
            } finally {
                setLoading(false)
            }
        }

        loadProducts()
    }, [])

    return { products, loading, error }
}