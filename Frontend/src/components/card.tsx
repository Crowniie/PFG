import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export default function Card(props: CardProps) {
  const { children, className = "", ...rest } = props;

  return (
    <div
      {...rest}
      className={
        "bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.3)] " +
        className
      }
    >
      {children}
    </div>
  );
}