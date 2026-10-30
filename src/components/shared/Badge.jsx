export default function Badge({ children, color = 'cyan', className = '' }) {
  const colors = {
    cyan: 'bg-cyberCyan-500/10 text-cyberCyan-400 border-cyberCyan-500/30',
    emerald: 'bg-cyberEmerald-500/10 text-cyberEmerald-400 border-cyberEmerald-500/30',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    red: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    slate: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium tracking-wide ${colors[color]} ${className}`}
    >
      {children}
    </span>
  );
}