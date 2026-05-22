import type { InputHTMLAttributes } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string
    error?: string
}

export function Input({ label, error, className = "", ...props }: InputProps) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm font-medium text-neutral-800">
                {label}
            </label>

            <input
                className={`
                    w-full rounded-xl border bg-white px-4 py-2.5 text-sm
                    outline-none transition
                    placeholder:text-neutral-400
                    focus:ring-2 focus:ring-emerald-500/30
                    ${error ? "border-red-400" : "border-neutral-200 focus:border-emerald-500"}
                    ${className}
                `}
                {...props}
            />

            {error && (
                <p className="text-xs text-red-600">
                    {error}
                </p>
            )}
        </div>
    )
}