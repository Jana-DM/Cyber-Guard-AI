import { useEffect, useRef } from 'react';

function lineClass(line) {
  if (line.startsWith('✓')) return 'text-cyberEmerald-400';
  if (line.startsWith('✗')) return 'text-rose-400';
  if (line.startsWith('$')) return 'text-cyberCyan-400';
  return 'text-slate-400';
}

export default function LogTerminal({ lines = [], emptyLabel = 'No output yet.', heightClass = 'h-72' }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className={`glass rounded-xl border border-slate-800 ${heightClass} flex flex-col overflow-hidden`}>
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-slate-800 bg-navy-900/60 shrink-0">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
        <span className="ml-3 text-[11px] text-slate-500 font-mono">cyberguard-terminal</span>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 font-mono text-[12.5px] leading-relaxed">
        {lines.length === 0 ? (
          <div className="text-slate-600 italic">{emptyLabel}</div>
        ) : (
          lines.map((line, i) => (
            <div key={i} className={`${lineClass(line)} whitespace-pre-wrap break-words`}>
              {line}
            </div>
          ))
        )}
      </div>
    </div>
  );
}