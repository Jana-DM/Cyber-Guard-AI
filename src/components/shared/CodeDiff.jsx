export default function CodeDiff({ before, after, filename }) {
  const beforeLines = before.split('\n');
  const afterLines = after.split('\n');

  return (
    <div className="rounded-xl border border-slate-800 overflow-hidden">
      {filename && (
        <div className="px-4 py-2 bg-navy-900/60 border-b border-slate-800 font-mono text-xs text-slate-400">
          {filename}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800">
        <div>
          <div className="px-3 py-1.5 bg-rose-500/10 text-rose-400 text-[11px] font-semibold border-b border-slate-800">
            BEFORE
          </div>
          <div className="p-4 text-[12px] font-mono leading-relaxed overflow-x-auto bg-navy-900/30">
            {beforeLines.map((line, i) => (
              <div key={i} className={`px-1 ${afterLines[i] !== line ? 'bg-rose-500/10' : ''}`}>
                <span className="text-slate-600 select-none mr-3">{i + 1}</span>
                <span className="text-slate-300 whitespace-pre">{line || ' '}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="px-3 py-1.5 bg-cyberEmerald-500/10 text-cyberEmerald-400 text-[11px] font-semibold border-b border-slate-800">
            AFTER
          </div>
          <div className="p-4 text-[12px] font-mono leading-relaxed overflow-x-auto bg-navy-900/30">
            {afterLines.map((line, i) => (
              <div key={i} className={`px-1 ${beforeLines[i] !== line ? 'bg-cyberEmerald-500/10' : ''}`}>
                <span className="text-slate-600 select-none mr-3">{i + 1}</span>
                <span className="text-slate-300 whitespace-pre">{line || ' '}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}