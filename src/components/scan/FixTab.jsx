import { Check, X, ShieldAlert, GitCommit } from 'lucide-react';
import CodeDiff from '../shared/CodeDiff';
import PrincipleCallout from '../shared/PrincipleCallout';
import VulnStateBadge from '../shared/VulnStateBadge';
import { VULN_STATE } from '../../constants/status';

export default function FixTab({ vuln, onDecide }) {
  const canDecide = vuln.status === VULN_STATE.FIX_PROPOSED;
  const decided = [
    VULN_STATE.APPROVED,
    VULN_STATE.UNRESOLVED,
    VULN_STATE.FIX_APPLIED,
    VULN_STATE.RESCAN,
    VULN_STATE.VERIFIED,
  ].includes(vuln.status);

  return (
    <div className="space-y-5">
      <PrincipleCallout tone="amber" icon={ShieldAlert}>
        <span className="font-medium text-amber-200">No change is applied without approval.</span> This diff is a
        proposal only. Approving it here only marks it ready — the pipeline applies it during the Remediation stage.
      </PrincipleCallout>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <GitCommit className="w-3.5 h-3.5" /> {vuln.fix.file}
        </div>
        <VulnStateBadge state={vuln.status} />
      </div>

      <CodeDiff before={vuln.fix.before} after={vuln.fix.after} filename={vuln.fix.file} />

      {canDecide ? (
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => onDecide(vuln.id, 'REJECTED')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-sm font-semibold transition-colors"
          >
            <X className="w-4 h-4" /> Reject Fix
          </button>
          <button
            onClick={() => onDecide(vuln.id, 'APPROVED')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cyberEmerald-500 hover:bg-cyberEmerald-400 text-navy-900 text-sm font-bold transition-colors shadow-glowEmerald"
          >
            <Check className="w-4 h-4" /> Approve Fix
          </button>
        </div>
      ) : decided ? (
        <div className="text-sm text-slate-400">
          Decision recorded. Head to the <span className="text-cyberCyan-300 font-medium">Pipeline</span> or{' '}
          <span className="text-cyberCyan-300 font-medium">Verification</span> screen to continue the run.
        </div>
      ) : (
        <div className="text-sm text-slate-500 italic">
          A fix proposal becomes available after the AI stage runs in the Pipeline.
        </div>
      )}
    </div>
  );
}