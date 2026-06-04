import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-[0_4px_12px_rgba(20,184,166,0.15)]",
  secondary:
    "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700",
  ghost: "bg-transparent hover:bg-slate-800 text-slate-300",
  danger: "bg-red-500 hover:bg-red-400 text-white",
};

export default function Button({
  children,
  variant = "primary",
  fullWidth = false,
  className = "",
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled}
      className={`
        ${variantStyles[variant]}
        ${fullWidth ? "w-full" : ""}
        font-medium uppercase tracking-wider text-sm
        py-2.5 px-4 rounded-lg
        transition-colors active:scale-[0.99]
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
}