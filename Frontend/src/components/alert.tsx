import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

type AlertVariant = "error" | "success" | "info";

interface AlertProps {
  variant?: AlertVariant;
  children: ReactNode;
}

const variantStyles: Record<AlertVariant, string> = {
  error: "bg-red-500/10 border-red-500/20 text-red-400",
  success: "bg-green-500/10 border-green-500/20 text-green-400",
  info: "bg-blue-500/10 border-blue-500/20 text-blue-400",
};

const variantIcons = {
  error: AlertCircle,
  success: CheckCircle2,
  info: Info,
};

export default function Alert({ variant = "info", children }: AlertProps) {
  const Icon = variantIcons[variant];
  return (
    <div
      className={`${variantStyles[variant]} border rounded-lg p-3 flex items-start gap-2`}
    >
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <p className="text-sm">{children}</p>
    </div>
  );
}