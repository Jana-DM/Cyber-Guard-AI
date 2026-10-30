import { ShieldAlert, ShieldX, ShieldQuestion, Info } from "lucide-react";

const SEVERITY_CONFIG = {
  CRITICAL: {
    label: "Critical",
    icon: ShieldX,
    classes: "bg-red-500/15 text-red-400 border-red-500/40",
    glow: "shadow-[0_0_12px_rgba(248,113,113,0.25)]",
  },
  HIGH: {
    label: "High",
    icon: ShieldAlert,
    classes: "bg-orange-500/15 text-orange-400 border-orange-500/40",
    glow: "shadow-[0_0_12px_rgba(251,146,60,0.2)]",
  },
  MEDIUM: {
    label: "Medium",
    icon: ShieldQuestion,
    classes: "bg-amber-500/15 text-amber-400 border-amber-500/40",
    glow: "shadow-[0_0_10px_rgba(251,191,36,0.18)]",
  },
  LOW: {
    label: "Low",
    icon: Info,
    classes: "bg-cyan-500/15 text-cyan-400 border-cyan-500/40",
    glow: "",
  },
  INFO: {
    label: "Info",
    icon: Info,
    classes: "bg-slate-500/15 text-slate-300 border-slate-500/40",
    glow: "",
  },
};

export default function SeverityBadge({ severity, size = "md" }) {
  const key = String(severity || "INFO").toUpperCase();
  const config = SEVERITY_CONFIG[key] || SEVERITY_CONFIG.INFO;
  const Icon = config.icon;

  const sizeClasses =
    size === "sm"
      ? "text-[10px] px-2 py-0.5 gap-1"
      : "text-xs px-2.5 py-1 gap-1.5";

  const iconSize = size === "sm" ? 11 : 13;

  return (
    <span
      className={`inline-flex items-center rounded-full border font-mono font-semibold uppercase tracking-wide ${config.classes} ${config.glow} ${sizeClasses}`}
    >
      <Icon size={iconSize} strokeWidth={2.5} />
      {config.label}
    </span>
  );
}