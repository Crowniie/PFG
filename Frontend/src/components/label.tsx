import type { LabelHTMLAttributes, ReactNode } from "react";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
}

export default function Label({ children, className = "", ...rest }: LabelProps) {
  return (
    <label
      {...rest}
      className={`block text-xs font-medium text-slate-400 uppercase tracking-wider ${className}`}
    >
      {children}
    </label>
  );
}