import { Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { ProtectedRoute } from "./components/layout/ProtectedRoute"
import { Dashboard } from "./pages/Dashboard"
import { Products } from "./pages/Products"
import { Cart } from "./pages/Cart"
import { Orders } from "./pages/Orders"
import { OrderDetails } from "./pages/OrderDetails"
import { ProductDetails } from "./pages/ProductDetails"
import { Profile } from "./pages/Profile"
import { AdminProducts } from "./pages/AdminProducts"
import { AdminOrders } from "./pages/AdminOrders"
import { Checkout } from "./pages/Checkout"

function App() {
    return (
        <>
            <Toaster position="top-right" />

            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/products"
                    element={
                        <ProtectedRoute>
                            <Products />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/cart"
                    element={
                        <ProtectedRoute>
                            <Cart />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/orders"
                    element={
                        <ProtectedRoute>
                            <Orders />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/orders/:id"
                    element={
                        <ProtectedRoute>
                            <OrderDetails />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/products/:id"
                    element={
                        <ProtectedRoute>
                            <ProductDetails />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/products"
                    element={
                        <ProtectedRoute adminOnly>
                            <AdminProducts />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/orders"
                    element={
                        <ProtectedRoute adminOnly>
                            <AdminOrders />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/checkout"
                    element={
                        <ProtectedRoute>
                            <Checkout />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </>
    )
}

export default App