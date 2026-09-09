import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "danger";
}

export function Button({
  isLoading = false,
  variant = "primary",
  disabled,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const variantClass = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
    secondary: "bg-slate-200 hover:bg-slate-300 text-slate-900",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  }[variant];

  return (
    <button
      {...rest}
      disabled={disabled || isLoading}
      className={`rounded-md px-4 py-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed ${variantClass} ${className}`}
    >
      {children}
    </button>
  );
}
