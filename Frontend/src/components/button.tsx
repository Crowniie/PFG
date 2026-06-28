import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: string;
  fullWidth?: boolean;
}

export default function Button(props: ButtonProps) {
  const {
    children,
    variant = "primary",
    fullWidth = false,
    className = "",
    disabled,
    ...rest
  } = props;

  // segun el tipo de boton le pongo unos estilos u otros
  let variantClass = "";
  if (variant === "primary") {
    variantClass =
      "bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-[0_4px_12px_rgba(20,184,166,0.15)]";
  } else if (variant === "secondary") {
    variantClass =
      "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700";
  } else if (variant === "ghost") {
    variantClass = "bg-transparent hover:bg-slate-800 text-slate-300";
  } else if (variant === "danger") {
    variantClass = "bg-red-500 hover:bg-red-400 text-white";
  }

  let widthClass = "";
  if (fullWidth === true) {
    widthClass = "w-full";
  }

  return (
    <button
      {...rest}
      disabled={disabled}
      className={
        variantClass +
        " " +
        widthClass +
        " font-medium uppercase tracking-wider text-sm py-2.5 px-4 rounded-lg transition-colors active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed " +
        className
      }
    >
      {children}
    </button>
  );
}