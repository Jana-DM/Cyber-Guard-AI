import { LogOut, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Badge from '../shared/Badge';

export default function Topbar() {
  const { state, dispatch } = useApp();

  return (
    <header className="h-16 border-b border-slate-800/80 bg-navy-900/40 backdrop-blur-sm sticky top-0 z-20 flex items-center justify-between px-5">
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-white">VulnShop Demo</span>
        <Badge color="slate">Authorized Mock Target</Badge>
      </div>

      <div className="flex items-center gap-3">
        <Badge color="amber" className="hidden sm:inline-flex">
          <Sparkles className="w-3.5 h-3.5" /> Simulated Demo Mode
        </Badge>
        <div className="text-right hidden sm:block">
          <div className="text-sm font-medium text-white">{state.user?.name}</div>
          <div className="text-[11px] text-slate-500">{state.user?.role}</div>
        </div>
        <button
          onClick={() => dispatch({ type: 'LOGOUT' })}
          className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          title="Log out"
        >
          <LogOut className="w-4.5 h-4.5" />
        </button>
      </div>
    </header>
  );
}