import { Routes, Route, Navigate } from "react-router-dom"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { ProtectedRoute } from "./components/layout/ProtectedRoute"
import { Dashboard } from "./pages/Dashboard"
import { Products } from "./pages/Products"
import { Cart } from "./pages/Cart"
import { Orders } from "./pages/Orders"
import { OrderDetails } from "./pages/OrderDetails"
import { ProductDetails } from "./pages/ProductDetails"

function App() {
    return (
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
            />,
            <Route
                path="/orders"
                element={
                    <ProtectedRoute>
                        <Orders />
                    </ProtectedRoute>
                }
            />,
            <Route
                path="/orders/:id"
                element={
                    <ProtectedRoute>
                        <OrderDetails />
                    </ProtectedRoute>
                }
            />,
            <Route
                path="/products/:id"
                element={
                    <ProtectedRoute>
                        <ProductDetails />
                    </ProtectedRoute>
                }
            />
        </Routes>
    )
}

export default App