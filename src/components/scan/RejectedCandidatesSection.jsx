import { XCircle } from 'lucide-react';
import SeverityBadge from '../shared/SeverityBadge';
import PrincipleCallout from '../shared/PrincipleCallout';

export default function RejectedCandidatesSection({ candidates }) {
  return (
    <div>
      <PrincipleCallout tone="amber" icon={XCircle}>
        <span className="font-medium text-amber-200">Candidate findings failed validation.</span> The scanner
        flagged these as potential issues, but evidence-based validation could not confirm them as real
        vulnerabilities — raw scanner signal is never treated as confirmed.
      </PrincipleCallout>

      <div className="mt-4 space-y-3">
        {candidates.map((c) => (
          <div key={c.id} className="rounded-xl border border-slate-800 bg-navy-900/30 p-4">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-slate-300">{c.type}</span>
                  <SeverityBadge severity={c.severity} />
                </div>
                <div className="text-xs text-slate-500 font-mono mt-1">{c.location}</div>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-full border border-slate-700 text-slate-500 font-medium shrink-0">
                Failed Validation
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">{c.reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
}