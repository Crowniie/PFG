import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

interface AlertProps {
  variant?: string;
  children: ReactNode;
}

export default function Alert(props: AlertProps) {
  const { variant = "info", children } = props;

  // por defecto es info (azul)
  let styleClass = "bg-blue-500/10 border-blue-500/20 text-blue-400";
  let Icon = Info;

  if (variant === "error") {
    styleClass = "bg-red-500/10 border-red-500/20 text-red-400";
    Icon = AlertCircle;
  } else if (variant === "success") {
    styleClass = "bg-green-500/10 border-green-500/20 text-green-400";
    Icon = CheckCircle2;
  }

  return (
    <div
      className={styleClass + " border rounded-lg p-3 flex items-start gap-2"}
    >
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <p className="text-sm">{children}</p>
    </div>
  );
}