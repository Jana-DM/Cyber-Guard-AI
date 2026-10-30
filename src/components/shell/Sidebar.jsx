import * as Icons from 'lucide-react';
import { NAV_ITEMS } from '../../constants/routes';
import { useApp } from '../../context/AppContext';

export default function Sidebar() {
  const { state, dispatch } = useApp();

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 bg-navy-900/60 border-r border-slate-800/80 h-screen sticky top-0">
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-slate-800/80">
        <Icons.ShieldCheck className="w-6 h-6 text-cyberCyan-400" />
        <span className="font-extrabold text-white tracking-tight">
          CyberGuard <span className="text-cyberCyan-400">AI</span>
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = state.currentRoute === item.id;
          return (
            <button
              key={item.id}
              onClick={() => dispatch({ type: 'NAVIGATE', payload: item.id })}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${active
                  ? 'bg-cyberCyan-500/10 text-cyberCyan-300 border border-cyberCyan-500/30 shadow-glowCyan'
                  : 'text-slate-400 hover:text-white hover:bg-navy-800/80 border border-transparent'}`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800/80 text-[11px] text-slate-500 leading-relaxed">
        <span className="text-amber-400 font-semibold">Simulated Demo Mode</span>
        <br />
        No real scans, deployments, or GitHub operations occur.
      </div>
    </aside>
  );
}