import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Navbar } from "../components/layout/Navbar"
import { useAuth } from "../hooks/useAuth"
import { getProducts, deleteProduct, createProduct, updateProduct } from "../api/products"
import { getCategories } from "../api/categories"
import type { Product, CreateProductInput, Category } from "../types"


export function AdminProducts() {
    const { token } = useAuth()

    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState<CreateProductInput>({
        name: "",
        description: "",
        price: 0,
        stock_quantity: 0,
        image_url: "",
        category_id: null
    })
    const [editingProductId, setEditingProductId] = useState<number | null>(null)

    useEffect(() => {
        async function loadAdminData() {
            try {
                const [productsData, categoriesData] = await Promise.all([
                    getProducts(),
                    getCategories()
                ])

                setProducts(productsData)
                setCategories(categoriesData)
            } finally {
                setLoading(false)
            }
        }

        loadAdminData()
    }, [])

    async function handleSubmitProduct(event: React.FormEvent) {
        event.preventDefault()

        if (!token) return

        try {
            const payload: CreateProductInput = {
                name: formData.name,
                description: formData.description,
                price: formData.price,
                stock_quantity: formData.stock_quantity,
                image_url: formData.image_url || null,
                category_id: formData.category_id || null
            }

            if (editingProductId) {
                const data = await updateProduct(
                    token,
                    editingProductId,
                    payload
                )

                setProducts((previousProducts) =>
                    previousProducts.map((product) =>
                        product.id === editingProductId
                            ? data.product
                            : product
                    )
                )

                toast.success("Product updated successfully.")
                setEditingProductId(null)
            } else {
                const data = await createProduct(token, payload)

                setProducts((previousProducts) => [
                    data.product,
                    ...previousProducts
                ])

                toast.success("Product created successfully.")
            }

            setFormData({
                name: "",
                description: "",
                price: 0,
                stock_quantity: 0,
                image_url: "",
                category_id: null
            })
        } catch {
            toast.error("Failed to save product.")
        }
    }

    async function handleDelete(productId: number) {
        if (!token) return

        const confirmed = window.confirm("Delete this product?")

        if (!confirmed) return

        try {
            await deleteProduct(token, productId)

            setProducts((previousProducts) =>
                previousProducts.filter(
                    (product) => product.id !== productId
                )
            )

            toast.success("Product deleted successfully.")
        } catch {
            toast.error("Failed to delete product.")
        }
    }

    function startEditProduct(product: Product) {
        setEditingProductId(product.id)

        setFormData({
            name: product.name,
            description: product.description,
            price: Number(product.price),
            stock_quantity: product.stock_quantity,
            image_url: product.image_url || "",
            category_id: product.category_id
        })

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }

    return (
        <div className="min-h-screen bg-neutral-100">
            <Navbar />

            <main className="mx-auto max-w-7xl px-6 py-10">
                <div className="mb-8">
                    <p className="text-sm font-semibold text-emerald-600">
                        Admin Panel
                    </p>

                    <h1 className="mt-2 text-3xl font-bold">
                        Product Management
                    </h1>

                    <p className="mt-2 text-neutral-500">
                        Create, view, and manage products available in Cartly.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmitProduct}
                    className="mb-8 rounded-2xl bg-white p-6 shadow-sm"
                >
                    <div>
                        <h2 className="text-xl font-semibold">
                            Create New Product
                        </h2>

                        <p className="mt-1 text-sm text-neutral-500">
                            Fill in the product details below. Fields marked with * are required.
                        </p>
                    </div>

                    <div className="mt-6 grid gap-5 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-neutral-700">
                                Product Name *
                            </label>

                            <input
                                value={formData.name}
                                onChange={(event) =>
                                    setFormData({
                                        ...formData,
                                        name: event.target.value
                                    })
                                }
                                placeholder="Example: MacBook Air"
                                className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-neutral-700">
                                Price ($) *
                            </label>

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={(event) =>
                                    setFormData({
                                        ...formData,
                                        price: Number(event.target.value)
                                    })
                                }
                                placeholder="Example: 1299.00"
                                className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-neutral-700">
                                Stock Quantity *
                            </label>

                            <input
                                type="number"
                                min="0"
                                value={formData.stock_quantity}
                                onChange={(event) =>
                                    setFormData({
                                        ...formData,
                                        stock_quantity: Number(event.target.value)
                                    })
                                }
                                placeholder="Example: 25"
                                className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-neutral-700">
                                Category
                            </label>

                            <select
                                value={formData.category_id ?? ""}
                                onChange={(event) =>
                                    setFormData({
                                        ...formData,
                                        category_id: event.target.value
                                            ? Number(event.target.value)
                                            : null
                                    })
                                }
                                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500"
                            >
                                <option value="">No category</option>

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

                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-neutral-700">
                                Image URL
                            </label>

                            <input
                                value={formData.image_url || ""}
                                onChange={(event) =>
                                    setFormData({
                                        ...formData,
                                        image_url: event.target.value
                                    })
                                }
                                placeholder="https://example.com/product.jpg"
                                className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-neutral-700">
                                Description *
                            </label>

                            <textarea
                                value={formData.description}
                                onChange={(event) =>
                                    setFormData({
                                        ...formData,
                                        description: event.target.value
                                    })
                                }
                                placeholder="Write a short product description..."
                                className="min-h-28 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="mt-6 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-600"
                    >
                        {editingProductId ? "Update Product" : "Create Product"}
                    </button>

                    {editingProductId && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditingProductId(null)
                                setFormData({
                                    name: "",
                                    description: "",
                                    price: 0,
                                    stock_quantity: 0,
                                    image_url: "",
                                    category_id: null
                                })
                            }}
                            className="ml-3 rounded-xl border border-neutral-200 px-5 py-3 text-sm font-medium hover:bg-neutral-100"
                        >
                            Cancel Edit
                        </button>
                    )}
                </form>

                {loading ? (
                    <p className="text-neutral-500">
                        Loading products...
                    </p>
                ) : (
                    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
                        <table className="w-full min-w-[720px]">
                            <thead>
                                <tr className="border-b bg-neutral-50">
                                    <th className="p-4 text-left text-sm font-semibold">
                                        Product
                                    </th>

                                    <th className="p-4 text-left text-sm font-semibold">
                                        Category ID
                                    </th>

                                    <th className="p-4 text-left text-sm font-semibold">
                                        Price
                                    </th>

                                    <th className="p-4 text-left text-sm font-semibold">
                                        Stock
                                    </th>

                                    <th className="p-4 text-right text-sm font-semibold">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {products.map((product) => (
                                    <tr
                                        key={product.id}
                                        className="border-b last:border-b-0"
                                    >
                                        <td className="p-4">
                                            <div>
                                                <p className="font-medium">
                                                    {product.name}
                                                </p>

                                                <p className="mt-1 line-clamp-1 text-sm text-neutral-500">
                                                    {product.description}
                                                </p>
                                            </div>
                                        </td>

                                        <td className="p-4 text-sm text-neutral-600">
                                            {categories.find(c => c.id === product.category_id)?.name ?? "None"}
                                        </td>

                                        <td className="p-4 font-medium">
                                            ${Number(product.price).toFixed(2)}
                                        </td>

                                        <td className="p-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-sm font-medium ${product.stock_quantity > 0
                                                    ? "bg-emerald-50 text-emerald-700"
                                                    : "bg-red-50 text-red-600"
                                                    }`}
                                            >
                                                {product.stock_quantity}
                                            </span>
                                        </td>

                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => startEditProduct(product)}
                                                className="mr-4 text-sm font-medium text-emerald-600 hover:text-emerald-700"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(product.id)
                                                }
                                                className="text-sm font-medium text-red-500 hover:text-red-600"
                                            >
                                                Delete
                                            </button>
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