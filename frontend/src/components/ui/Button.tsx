import type { ButtonHTMLAttributes } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
    variant?: "primary" | "secondary"
}

export function Button({
    children,
    variant = "primary",
    className = "",
    ...props
}: ButtonProps) {
    const base =
        "rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"

    const variants = {
        primary: "bg-[#0A0A0A] text-white hover:bg-neutral-800 shadow-sm",
        secondary: "bg-white text-[#0A0A0A] border border-neutral-200 hover:bg-neutral-50"
    }

    return (
        <button
            className={`${base} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}