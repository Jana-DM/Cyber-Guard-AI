import { Info } from 'lucide-react';

export default function PrincipleCallout({ children, icon: Icon = Info, tone = 'cyan' }) {
  const toneMap = {
    cyan: 'border-cyberCyan-500/30 text-cyberCyan-300 bg-cyberCyan-500/5',
    amber: 'border-amber-500/30 text-amber-300 bg-amber-500/5',
    emerald: 'border-cyberEmerald-500/30 text-cyberEmerald-300 bg-cyberEmerald-500/5',
  };
  return (
    <div className={`flex items-start gap-2.5 text-xs rounded-lg border px-3.5 py-2.5 ${toneMap[tone]}`}>
      <Icon className="w-4 h-4 shrink-0 mt-0.5" />
      <span>{children}</span>
    </div>
  );
}