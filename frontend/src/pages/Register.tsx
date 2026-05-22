import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"

export function Register() {
    const { register, loading } = useAuth()
    const navigate = useNavigate()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError("")

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters")
            return
        }

        try {
            await register(name, email, password)
            navigate("/dashboard")
        } catch {
            setError("Could not create account")
        }
    }

    return (
        <main className="min-h-screen grid lg:grid-cols-[1.1fr_0.9fr] bg-neutral-100">
            <section className="hidden lg:flex flex-col justify-between bg-[#0A0A0A] text-white p-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,#10B981,transparent_30%)]" />

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-neutral-300">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        New arrivals added weekly
                    </div>

                    <h1 className="mt-10 text-5xl font-bold tracking-tight leading-tight">
                        Create your Cartly <br />
                        shopping account.
                    </h1>

                    <p className="mt-6 max-w-lg text-neutral-300 text-lg leading-7">
                        Save your cart, track purchases, and discover curated essentials from a clean premium store.
                    </p>
                </div>

                <div className="relative z-10 grid grid-cols-3 gap-4">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-2xl font-bold">Easy</p>
                        <p className="text-sm text-neutral-400 mt-1">Checkout</p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-2xl font-bold">Smart</p>
                        <p className="text-sm text-neutral-400 mt-1">Cart</p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-2xl font-bold">Fast</p>
                        <p className="text-sm text-neutral-400 mt-1">Orders</p>
                    </div>
                </div>
            </section>

            <section className="flex items-center justify-center px-6 py-12">
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm"
                >
                    <div className="mb-8">
                        <p className="text-sm font-semibold text-emerald-600">
                            Cartly
                        </p>
                        <h2 className="mt-2 text-3xl font-bold tracking-tight">
                            Create your account
                        </h2>
                        <p className="mt-2 text-sm text-neutral-500">
                            Start discovering products tailored to your lifestyle.
                        </p>
                    </div>

                    {error && (
                        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    <div className="space-y-4">
                        <Input label="Name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <Input label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>

                    <Button type="submit" disabled={loading} className="mt-6 w-full">
                        {loading ? "Creating account..." : "Create account"}
                    </Button>

                    <p className="mt-6 text-center text-sm text-neutral-600">
                        Already have an account?{" "}
                        <Link to="/login" className="font-semibold text-[#0A0A0A] underline">
                            Sign in
                        </Link>
                    </p>
                </form>
            </section>
        </main>
    )
}