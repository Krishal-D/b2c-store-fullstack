import { useNavigate, Link } from "react-router-dom"
import { useState } from "react"
import toast from "react-hot-toast"
import { Navbar } from "../components/layout/Navbar"
import { useAuth } from "../hooks/useAuth"

export function Profile() {
    const { user, logout, updateProfile } = useAuth()
    const navigate = useNavigate()

    const [editing, setEditing] = useState(false)
    const [nameInput, setNameInput] = useState(user?.name ?? "")
    const [saving, setSaving] = useState(false)

    async function handleLogout() {
        await logout()
        navigate("/login")
    }

    async function handleSaveName() {
        if (!updateProfile) return
        if (!nameInput.trim()) {
            toast.error("Name cannot be empty")
            return
        }

        setSaving(true)

        try {
            await updateProfile({ name: nameInput.trim() })
            toast.success("Name updated")
            setEditing(false)
        } catch {
            toast.error("Failed to update name")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="min-h-screen bg-neutral-100">
            <Navbar />

            <main className="mx-auto max-w-4xl px-6 py-10">
                <div className="rounded-3xl bg-white p-8 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">
                        Profile
                    </p>

                    <h1 className="mt-3 text-3xl font-bold text-slate-900">
                        Account details
                    </h1>

                    <p className="mt-2 text-sm text-neutral-500 max-w-2xl">
                        View and manage your account settings.
                    </p>

                    <div className="mt-8 grid gap-6 sm:grid-cols-2">
                        <div className="rounded-3xl bg-neutral-50 p-6">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-neutral-500">Name</p>
                                {!editing ? (
                                    <button
                                        onClick={() => { setEditing(true); setNameInput(user?.name ?? "") }}
                                        className="text-sm font-medium text-emerald-600 hover:underline"
                                    >
                                        Edit
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setEditing(false)}
                                            className="text-sm text-neutral-500 hover:underline"
                                            disabled={saving}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSaveName}
                                            className="rounded-lg bg-emerald-500 px-3 py-1 text-sm font-semibold text-white hover:bg-emerald-600"
                                            disabled={saving}
                                        >
                                            {saving ? "Saving..." : "Save"}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {!editing ? (
                                <p className="mt-3 text-xl font-semibold text-slate-900">
                                    {user?.name ?? "—"}
                                </p>
                            ) : (
                                <input
                                    value={nameInput}
                                    onChange={(e) => setNameInput(e.target.value)}
                                    className="mt-3 w-full rounded-xl border border-neutral-200 px-4 py-2 outline-none focus:border-emerald-500"
                                />
                            )}
                        </div>

                        <div className="rounded-3xl bg-neutral-50 p-6">
                            <p className="text-sm text-neutral-500">Email</p>
                            <p className="mt-3 text-xl font-semibold text-slate-900">
                                {user?.email ?? "—"}
                            </p>
                        </div>

                        <div className="rounded-3xl bg-neutral-50 p-6">
                            <p className="text-sm text-neutral-500">Account ID</p>
                            <p className="mt-3 text-xl font-semibold text-slate-900">
                                CT{String(user?.id ?? 0).padStart(3, "0")}
                            </p>
                        </div>

                        <div className="rounded-3xl bg-neutral-50 p-6 sm:col-span-1">
                            <p className="text-sm text-neutral-500">Role</p>
                            <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-sm font-semibold text-slate-900 capitalize">
                                {user?.role}
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900">Quick actions</h2>
                        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Link to="/orders" className="rounded-lg bg-neutral-50 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100">
                                View Orders
                            </Link>

                            <Link to="/products" className="rounded-lg bg-neutral-50 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100">
                                Browse Products
                            </Link>

                            {user?.role === "admin" && (
                                <>
                                    <Link to="/admin/products" className="rounded-lg bg-neutral-50 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100">
                                        Admin Products
                                    </Link>

                                    <Link to="/admin/orders" className="rounded-lg bg-neutral-50 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100">
                                        Admin Orders
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-neutral-500">
                                Keep your account information up to date and sign out when you're finished.
                            </p>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
                        >
                            Log out
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}
