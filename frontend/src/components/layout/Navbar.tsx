import { useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { Menu, Search, ShoppingCart, User, X } from "lucide-react"
import { useCart } from "../../context/cartContext"

export function Navbar() {
    const { cartCount } = useCart()
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                <Link
                    to="/products"
                    className="text-xl font-bold tracking-tight"
                >
                    Cartly
                </Link>

                <div className="hidden md:flex flex-1 max-w-md mx-8">
                    <div className="relative w-full">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                        />

                        <input
                            type="text"
                            placeholder="Search products..."
                            className="
                                w-full
                                rounded-xl
                                border
                                border-neutral-200
                                bg-neutral-50
                                pl-10
                                pr-4
                                py-2
                                text-sm
                                outline-none
                                focus:border-emerald-500
                            "
                        />
                    </div>
                </div>

                <nav className="hidden md:flex items-center gap-6">
                    <NavLink
                        to="/products"
                        className={({ isActive }) =>
                            isActive
                                ? "font-semibold text-black"
                                : "text-neutral-500 hover:text-black"
                        }
                    >
                        Products
                    </NavLink>

                    <NavLink
                        to="/orders"
                        className={({ isActive }) =>
                            isActive
                                ? "font-semibold text-black"
                                : "text-neutral-500 hover:text-black"
                        }
                    >
                        Orders
                    </NavLink>
                </nav>

                <div className="flex items-center gap-4 ml-6">
                    <Link to="/cart" className="relative">
                        <ShoppingCart size={22} />

                        <span
                            className="
                                absolute
                                -right-2
                                -top-2
                                flex
                                h-5
                                w-5
                                items-center
                                justify-center
                                rounded-full
                                bg-emerald-500
                                text-xs
                                text-white
                            "
                        >
                            {cartCount}
                        </span>
                    </Link>

                    <button
                        className="
                            hidden
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-full
                            bg-neutral-100
                            md:flex
                        "
                    >
                        <User size={18} />
                    </button>

                    <button
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-full
                            bg-neutral-100
                            md:hidden
                        "
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {menuOpen && (
                <div className="border-t border-neutral-200 bg-white px-6 py-4 md:hidden">
                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                        />

                        <input
                            type="text"
                            placeholder="Search products..."
                            className="
                                w-full
                                rounded-xl
                                border
                                border-neutral-200
                                bg-neutral-50
                                pl-10
                                pr-4
                                py-2
                                text-sm
                                outline-none
                                focus:border-emerald-500
                            "
                        />
                    </div>

                    <nav className="mt-4 flex flex-col gap-3">
                        <NavLink
                            to="/products"
                            onClick={() => setMenuOpen(false)}
                            className={({ isActive }) =>
                                isActive
                                    ? "rounded-xl bg-neutral-100 px-4 py-2 font-semibold text-black"
                                    : "rounded-xl px-4 py-2 text-neutral-600 hover:bg-neutral-100"
                            }
                        >
                            Products
                        </NavLink>

                        <NavLink
                            to="/orders"
                            onClick={() => setMenuOpen(false)}
                            className={({ isActive }) =>
                                isActive
                                    ? "rounded-xl bg-neutral-100 px-4 py-2 font-semibold text-black"
                                    : "rounded-xl px-4 py-2 text-neutral-600 hover:bg-neutral-100"
                            }
                        >
                            Orders
                        </NavLink>

                        <NavLink
                            to="/cart"
                            onClick={() => setMenuOpen(false)}
                            className={({ isActive }) =>
                                isActive
                                    ? "rounded-xl bg-neutral-100 px-4 py-2 font-semibold text-black"
                                    : "rounded-xl px-4 py-2 text-neutral-600 hover:bg-neutral-100"
                            }
                        >
                            Cart ({cartCount})
                        </NavLink>
                    </nav>
                </div>
            )}
        </header>
    )
}