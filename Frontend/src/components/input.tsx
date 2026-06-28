import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasIconLeft?: boolean;
  hasIconRight?: boolean;
}

// uso forwardRef porque algunos sitios le pasan una ref al input
const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  props,
  ref
) {
  const { className = "", hasIconLeft, hasIconRight, ...rest } = props;

  // si hay icono a la izquierda le dejo mas hueco
  let paddingLeft = "pl-3";
  if (hasIconLeft) {
    paddingLeft = "pl-11";
  }

  let paddingRight = "pr-3";
  if (hasIconRight) {
    paddingRight = "pr-11";
  }

  return (
    <input
      {...rest}
      ref={ref}
      className={
        "w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg py-2.5 " +
        paddingLeft +
        " " +
        paddingRight +
        " focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors placeholder:text-slate-600 " +
        className
      }
    />
  );
});

export default Input;