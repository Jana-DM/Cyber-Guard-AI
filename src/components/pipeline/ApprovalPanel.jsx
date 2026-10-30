import { ShieldAlert, Check, X, Sparkles } from 'lucide-react';
import GlassCard from '../shared/GlassCard';
import Badge from '../shared/Badge';
import { VULN_STATE } from '../../constants/status';
import { SEVERITY_META } from '../../constants/severity';

export default function ApprovalPanel({ vulnerabilities, onDecide, onApproveAll }) {
  const pending = vulnerabilities.filter((v) => v.status === VULN_STATE.FIX_PROPOSED);
  const decided = vulnerabilities.filter((v) => v.status === VULN_STATE.APPROVED || v.status === VULN_STATE.UNRESOLVED);

  return (
    <GlassCard className="p-6 border border-amber-500/30 shadow-[0_0_24px_rgba(245,158,11,0.15)]">
      <div className="flex items-start gap-3 mb-5">
        <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h3 className="text-white font-bold">Approval Required</h3>
          <p className="text-sm text-slate-400 mt-0.5">
            <span className="text-amber-300 font-medium">No change is applied without approval.</span>{' '}
            Review each AI-explained, evidence-validated fix before remediation proceeds.
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-5">
        {vulnerabilities.map((v) => {
          const sev = SEVERITY_META[v.severity];
          const isPending = v.status === VULN_STATE.FIX_PROPOSED;
          const isApproved = v.status === VULN_STATE.APPROVED;
          const isRejected = v.status === VULN_STATE.UNRESOLVED;
          return (
            <div
              key={v.id}
              className={`flex items-center justify-between gap-4 px-4 py-3 rounded-xl border bg-navy-900/50
                ${isApproved ? 'border-cyberEmerald-500/30' : isRejected ? 'border-rose-500/30' : 'border-slate-800'}`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-white truncate">{v.type}</span>
                  <Badge color={sev.badge}>{sev.label}</Badge>
                </div>
                <div className="text-xs text-slate-500 font-mono mt-0.5 truncate">{v.location}</div>
              </div>

              {isPending ? (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onDecide(v.id, 'REJECTED')}
                    className="p-2 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Reject fix"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDecide(v.id, 'APPROVED')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyberEmerald-500 hover:bg-cyberEmerald-400 text-navy-900 text-sm font-semibold transition-colors"
                  >
                    <Check className="w-4 h-4" /> Approve
                  </button>
                </div>
              ) : (
                <Badge color={isApproved ? 'emerald' : 'red'} className="shrink-0">
                  {isApproved ? 'Approved' : 'Rejected'}
                </Badge>
              )}
            </div>
          );
        })}
      </div>

      {pending.length > 0 ? (
        <button
          onClick={onApproveAll}
          className="w-full flex items-center justify-center gap-2 bg-cyberCyan-500 hover:bg-cyberCyan-400 text-navy-900 font-semibold py-2.5 rounded-lg transition-colors shadow-glowCyan"
        >
          <Sparkles className="w-4 h-4" /> Approve All & Continue
        </button>
      ) : (
        <div className="text-center text-sm text-slate-400">
          {decided.length} of {vulnerabilities.length} findings decided — pipeline resuming...
        </div>
      )}
    </GlassCard>
  );
}