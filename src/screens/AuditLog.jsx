import {
  PlayCircle,
  RotateCcw,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  Ban,
  CheckCircle2,
  GitBranch,
  GitCommit,
  GitPullRequest,
  FileSearch,
  Activity,
} from "lucide-react";
import { useDemo } from "../context/DemoContext";
import GlassCard from "../components/shared/GlassCard";

const ACTION_META = {
  PIPELINE_STARTED: { label: "Pipeline started", icon: PlayCircle, color: "text-cyan-400" },
  PIPELINE_RESET: { label: "Pipeline reset", icon: RotateCcw, color: "text-slate-400" },
  STAGE_FAILED: { label: "Stage failed", icon: XCircle, color: "text-red-400" },
  FINDING_VALIDATED: { label: "Finding validated", icon: FileSearch, color: "text-cyan-400" },
  CANDIDATE_REJECTED: { label: "Candidate rejected", icon: Ban, color: "text-slate-400" },
  FIX_APPROVED: { label: "Fix approved", icon: CheckCircle2, color: "text-emerald-400" },
  FIX_REJECTED: { label: "Fix rejected", icon: XCircle, color: "text-red-400" },
  REMEDIATION_APPLIED: { label: "Remediation applied", icon: ShieldAlert, color: "text-amber-400" },
  VERIFICATION_PASSED: { label: "Verification passed", icon: ShieldCheck, color: "text-emerald-400" },
  VERIFICATION_FAILED: { label: "Verification failed", icon: ShieldAlert, color: "text-red-400" },
  GIT_BRANCH_CREATED: { label: "Branch created", icon: GitBranch, color: "text-cyan-400" },
  GIT_COMMIT: { label: "Commit created", icon: GitCommit, color: "text-cyan-400" },
  GIT_PUSH: { label: "Pushed to remote", icon: GitPullRequest, color: "text-emerald-400" },
};

const RESULT_STYLES = {
  SUCCESS: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  FAILED: "border-red-500/40 bg-red-500/10 text-red-400",
  INFO: "border-cyan-500/40 bg-cyan-500/10 text-cyan-400",
};

function formatTime(ts) {
  try {
    return new Date(ts).toLocaleTimeString([], { hour12: false });
  } catch {
    return String(ts);
  }
}

export default function AuditLog() {
  const { state } = useDemo();
  const events = state.auditLog || [];

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white">Audit Log</h1>
        <p className="mt-1 text-sm text-slate-400">
          Full trail of approvals, rejections, remediation, verification, and
          git operations — Simulated Demo Mode.
        </p>
      </div>

      {events.length === 0 ? (
        <GlassCard className="flex flex-col items-center justify-center gap-3 p-10 text-center">
          <Activity size={32} className="text-slate-600" />
          <p className="text-sm text-slate-500">
            No activity yet. Run the demo pipeline to generate audit events.
          </p>
        </GlassCard>
      ) : (
        <GlassCard className="divide-y divide-slate-800/80 p-0">
          {events.map((e) => {
            const meta = ACTION_META[e.action] || {
              label: e.action,
              icon: Activity,
              color: "text-slate-400",
            };
            const Icon = meta.icon;
            const resultClass = RESULT_STYLES[e.result] || RESULT_STYLES.INFO;

            return (
              <div
                key={e.id}
                className="flex flex-wrap items-start gap-4 px-5 py-4 text-sm"
              >
                <div className={`mt-0.5 shrink-0 ${meta.color}`}>
                  <Icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-white">
                      {meta.label}
                    </span>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-mono uppercase tracking-wide ${resultClass}`}
                    >
                      {e.result}
                    </span>
                  </div>
                  {e.details && (
                    <p className="mt-1 text-xs text-slate-400">{e.details}</p>
                  )}
                  <div className="mt-1.5 flex items-center gap-2 font-mono text-[11px] text-slate-600">
                    <span>{e.user || "system"}</span>
                    <span>·</span>
                    <span>{formatTime(e.timestamp)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </GlassCard>
      )}
    </div>
  );
}