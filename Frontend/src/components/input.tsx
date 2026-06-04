import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasIconLeft?: boolean;
  hasIconRight?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", hasIconLeft, hasIconRight, ...rest }, ref) => {
    const paddingLeft = hasIconLeft ? "pl-11" : "pl-3";
    const paddingRight = hasIconRight ? "pr-11" : "pr-3";
    return (
      <input
        {...rest}
        ref={ref}
        className={`w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg py-2.5 ${paddingLeft} ${paddingRight} focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors placeholder:text-slate-600 ${className}`}
      />
    );
  }
);

Input.displayName = "Input";
export default Input;