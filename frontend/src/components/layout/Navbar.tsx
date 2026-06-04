import { useEffect, useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { Menu, ShoppingCart, User, X, Sun, Moon } from "lucide-react"
import { useCart } from "../../context/cartContext"
import { useAuth } from "../../hooks/useAuth"
import { Button } from "../ui/Button"

export function Navbar() {
    const { cartCount } = useCart()
    const { user } = useAuth()
    const [menuOpen, setMenuOpen] = useState(false)
    const [dark, setDark] = useState(false)

    const isAdmin = user?.role === "admin"

    const productsPath = isAdmin ? "/admin/products" : "/products"
    const ordersPath = isAdmin ? "/admin/orders" : "/orders"

    useEffect(() => {
        try {
            const stored = localStorage.getItem("theme")
            if (stored === "dark") {
                setDark(true)
                document.documentElement.classList.add("dark")
            }
        } catch { }
    }, [])

    function toggleTheme() {
        const next = !dark
        setDark(next)

        try {
            if (next) {
                document.documentElement.classList.add("dark")
                localStorage.setItem("theme", "dark")
            } else {
                document.documentElement.classList.remove("dark")
                localStorage.setItem("theme", "light")
            }
        } catch { }
    }

    return (
        <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                <Link
                    to="/dashboard"
                    className="text-xl font-bold tracking-tight"
                >
                    Cartly
                </Link>

                <div className="hidden md:block flex-1 max-w-md mx-8" />


                <nav className="hidden md:flex flex-1 items-center justify-center gap-8">
                    <NavLink
                        to={productsPath}
                        className={({ isActive }) =>
                            isActive
                                ? "font-semibold text-black"
                                : "text-neutral-500 hover:text-black"
                        }
                    >
                        Products
                    </NavLink>

                    <NavLink
                        to={ordersPath}
                        className={({ isActive }) =>
                            isActive
                                ? "font-semibold text-black"
                                : "text-neutral-500 hover:text-black"
                        }
                    >
                        Orders
                    </NavLink>
                </nav>

                <div className="flex items-center gap-4">
                    {!isAdmin && (
                        <Link to="/cart" className="relative">
                            <ShoppingCart size={22} />

                            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs text-white">
                                {cartCount}
                            </span>
                        </Link>
                    )}

                    <Link
                        to="/profile"
                        className="hidden h-9 w-9 items-center justify-center rounded-full bg-neutral-100 md:flex"
                        aria-label="Profile"
                    >
                        <User size={18} />
                    </Link>

                    <Button
                        type="button"
                        variant="secondary"
                        className="hidden h-9 w-9 rounded-full p-0 md:flex items-center justify-center"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                    >
                        {dark ? (
                            <div className="flex items-center gap-1.5">
                                <Sun size={16} />
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5">
                                <Moon size={16} />
                            </div>
                        )}
                    </Button>

                    <button
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 md:hidden"
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {menuOpen && (
                <div className="border-t border-neutral-200 bg-white px-6 py-4 md:hidden">

                    <nav className="mt-4 flex flex-col gap-3">
                        <NavLink
                            to={productsPath}
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
                            to={ordersPath}
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
                            to="/profile"
                            onClick={() => setMenuOpen(false)}
                            className={({ isActive }) =>
                                isActive
                                    ? "rounded-xl bg-neutral-100 px-4 py-2 font-semibold text-black"
                                    : "rounded-xl px-4 py-2 text-neutral-600 hover:bg-neutral-100"
                            }
                        >
                            Profile
                        </NavLink>

                        {!isAdmin && (
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
                        )}
                    </nav>

                    <div className="mt-4 flex items-center justify-between gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            className="h-10 w-10 rounded-full p-0"
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                        >
                            {dark ? <Sun size={16} /> : <Moon size={16} />}
                        </Button>
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            {dark ? "Dark mode" : "Light mode"}
                        </span>
                    </div>
                </div>
            )}
        </header>
    )
}
