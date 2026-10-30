import { motion } from "framer-motion";
import {
  GitBranch,
  GitCommit,
  GitPullRequest,
  CheckCircle2,
  Ban,
  Clock,
  Sparkles,
} from "lucide-react";
import { useDemo } from "../context/DemoContext";
import GlassCard from "../components/shared/GlassCard";

const WORKFLOW = {
  branch: "cyberguard/fix-xss-001",
  baseBranch: "feature/checkout-v2",
  commitMessage:
    "fix(security): sanitize reflected XSS in /search query parameter\n\nCyberGuard AI — Simulated Demo Mode\nFinding: CG-RULE-XSS-01\nVerification: re-scan confirmed payload no longer reflects unescaped.",
  commitHashShort: "a93f1c2",
  commitHashFull: "a93f1c2e7b4d5f0918273645ab6c7d8e9f0a1b2c",
  prTitle: "Fix: Controlled Reflected XSS in search endpoint (CyberGuard AI)",
  prChecks: [
    { id: "install", label: "Install dependencies" },
    { id: "build", label: "Build" },
    { id: "test", label: "Run test suite" },
    { id: "rescan", label: "Security re-scan" },
  ],
};

function PrincipleNote({ children }) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-4 py-3 text-xs text-cyan-200/90">
      <Sparkles size={15} className="mt-0.5 shrink-0 text-cyan-400" />
      <p className="leading-relaxed">{children}</p>
    </div>
  );
}

export default function GitHubScreen() {
  const { state } = useDemo();
  const done = state.github?.status === "DONE";

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">GitHub</h1>
          <p className="mt-1 text-sm text-slate-400">
            Simulated Demo Mode — no real repository is modified.
          </p>
        </div>
        <span
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-mono uppercase tracking-wide ${
            done
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
              : "border-slate-700 bg-slate-800/50 text-slate-500"
          }`}
        >
          {done ? <CheckCircle2 size={13} /> : <Clock size={13} />}
          {done ? "Ready for review" : "Pending"}
        </span>
      </div>

      <PrincipleNote>
        Never push to main. All remediation branches target a feature branch —
        never the production <code className="font-mono">main</code> branch.
      </PrincipleNote>

      {!done ? (
        <GlassCard className="flex flex-col items-center justify-center gap-3 p-10 text-center">
          <GitPullRequest size={32} className="text-slate-600" />
          <p className="text-sm text-slate-500">
            Run the demo pipeline through Verification to generate the
            simulated branch, commit, and pull request here.
          </p>
        </GlassCard>
      ) : (
        <>
          <GlassCard className="space-y-4 p-6">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <GitBranch size={16} className="text-cyan-400" />
              <span className="font-mono text-cyan-300">{WORKFLOW.branch}</span>
              <span className="text-slate-600">from</span>
              <span className="font-mono text-slate-400">
                {WORKFLOW.baseBranch}
              </span>
              <span className="ml-auto flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-mono uppercase text-red-400">
                <Ban size={10} />
                never main
              </span>
            </div>

            <div className="rounded-lg border border-slate-700/60 bg-slate-950/60 p-4">
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <GitCommit size={13} />
                <span className="font-mono">{WORKFLOW.commitHashShort}</span>
                <span className="text-slate-700">·</span>
                <span className="font-mono">{WORKFLOW.commitHashFull}</span>
              </div>
              <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-300">
                {WORKFLOW.commitMessage}
              </pre>
            </div>
          </GlassCard>

          <GlassCard className="space-y-4 p-6">
            <div className="flex items-center gap-2">
              <GitPullRequest size={16} className="text-emerald-400" />
              <h3 className="font-semibold text-white">{WORKFLOW.prTitle}</h3>
            </div>
            <div className="space-y-2">
              {WORKFLOW.prChecks.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center justify-between rounded-md border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs"
                >
                  <span className="text-slate-300">{c.label}</span>
                  <span className="flex items-center gap-1 font-mono uppercase text-emerald-400">
                    <CheckCircle2 size={12} />
                    Passed
                  </span>
                </motion.div>
              ))}
            </div>
            <div className="rounded-md border border-cyan-500/20 bg-cyan-500/5 px-3 py-2 text-xs text-cyan-300">
              All checks passed — ready for human review. No automatic merge
              occurs.
            </div>
          </GlassCard>
        </>
      )}
    </div>
  );
}