import { CheckCircle2, XCircle, Loader2, Circle, MinusCircle } from 'lucide-react';

const CONFIG = {
  PENDING: { label: 'Pending', color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/30', icon: Circle },
  RUNNING: { label: 'Running', color: 'text-cyberCyan-400', bg: 'bg-cyberCyan-500/10 border-cyberCyan-500/30', icon: Loader2 },
  SUCCESS: { label: 'Success', color: 'text-cyberEmerald-400', bg: 'bg-cyberEmerald-500/10 border-cyberEmerald-500/30', icon: CheckCircle2 },
  FAILED: { label: 'Failed', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30', icon: XCircle },
  SKIPPED: { label: 'Skipped', color: 'text-slate-500', bg: 'bg-slate-500/5 border-slate-700/50', icon: MinusCircle },
};

export default function StatusChip({ status, className = '' }) {
  const cfg = CONFIG[status] ?? CONFIG.PENDING;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${cfg.bg} ${cfg.color} ${className}`}>
      <Icon className={`w-3.5 h-3.5 ${status === 'RUNNING' ? 'animate-spin' : ''}`} />
      {cfg.label}
    </span>
  );
}