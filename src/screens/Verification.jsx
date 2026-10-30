import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useDemo } from "../context/DemoContext";
import GlassCard from "../components/shared/GlassCard";
import SeverityBadge from "../components/shared/SeverityBadge";

function PrincipleNote({ children }) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-4 py-3 text-xs text-cyan-200/90">
      <Sparkles size={15} className="mt-0.5 shrink-0 text-cyan-400" />
      <p className="leading-relaxed">{children}</p>
    </div>
  );
}

const STATE_ORDER = [
  "DETECTED",
  "VALIDATED",
  "FIX_PROPOSED",
  "APPROVED",
  "FIX_APPLIED",
  "RESCAN",
  "VERIFIED",
];

function MiniTimeline({ status }) {
  const isFailure = status === "TEST_FAILED" || status === "UNRESOLVED";
  const currentIndex = STATE_ORDER.indexOf(status);

  return (
    <div className="flex flex-wrap items-center gap-1 overflow-x-auto py-1">
      {STATE_ORDER.map((step, i) => {
        const reached = !isFailure && i <= currentIndex;
        const isCurrent = !isFailure && i === currentIndex;
        return (
          <div key={step} className="flex items-center gap-1">
            <div
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-mono uppercase tracking-wide whitespace-nowrap ${
                isCurrent
                  ? "border-emerald-400/60 bg-emerald-500/15 text-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.3)]"
                  : reached
                  ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-400/70"
                  : "border-slate-700 bg-slate-800/40 text-slate-500"
              }`}
            >
              {step.replace("_", " ")}
            </div>
            {i < STATE_ORDER.length - 1 && (
              <ArrowRight size={11} className="text-slate-600 shrink-0" />
            )}
          </div>
        );
      })}
      {isFailure && (
        <div className="ml-1 flex items-center gap-1.5 rounded-full border border-red-500/50 bg-red-500/15 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wide text-red-400">
          <XCircle size={11} />
          {status.replace("_", " ")}
        </div>
      )}
    </div>
  );
}

function Celebration({ active }) {
  const [particles] = useState(() =>
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.4,
      color: ["#22d3ee", "#34d399", "#fbbf24"][i % 3],
      size: 4 + Math.random() * 5,
    }))
  );

  return (
    <AnimatePresence>
      {active && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
          {particles.map((p) => (
            <motion.span
              key={p.id}
              initial={{ y: -20, x: `${p.x}%`, opacity: 0 }}
              animate={{ y: 220, opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.8, delay: p.delay, ease: "easeIn" }}
              style={{
                position: "absolute",
                width: p.size,
                height: p.size,
                borderRadius: 9999,
                backgroundColor: p.color,
                top: 0,
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

export default function Verification() {
  const { state } = useDemo();
  const verification = state.verification;
  const isDone = verification?.status === "DONE";
  const [celebrate, setCelebrate] = useState(false);
  const [hasCelebrated, setHasCelebrated] = useState(false);

  useEffect(() => {
    if (isDone && !hasCelebrated) {
      setCelebrate(true);
      setHasCelebrated(true);
      const t = setTimeout(() => setCelebrate(false), 2200);
      return () => clearTimeout(t);
    }
    if (!isDone) {
      setHasCelebrated(false);
    }
  }, [isDone, hasCelebrated]);

  if (!isDone) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-4 rounded-full border border-slate-700 bg-slate-800/50 p-4">
          <RotateCcw size={28} className="text-slate-500" />
        </div>
        <h2 className="text-lg font-semibold text-slate-300">
          No verification yet
        </h2>
        <p className="mt-2 max-w-md text-sm text-slate-500">
          Run the demo pipeline, approve a fix, and let remediation complete.
          Verification results will appear here once the re-scan finishes.
        </p>
      </div>
    );
  }

  const results = verification.results || [];

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white">Verification</h1>
        <p className="mt-1 text-sm text-slate-400">
          Simulated Demo Mode — before/after comparison from the re-scan.
        </p>
      </div>

      <PrincipleNote>Re-scan proves the fix. A code edit alone does not.</PrincipleNote>

      <GlassCard className="relative overflow-hidden p-8">
        <Celebration active={celebrate} />
        <div className="flex flex-col items-center text-center">
          <motion.div
            animate={{
              boxShadow: [
                "0 0 0px rgba(52,211,153,0.4)",
                "0 0 28px rgba(52,211,153,0.55)",
                "0 0 0px rgba(52,211,153,0.4)",
              ],
            }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400/50 bg-emerald-500/10"
          >
            <ShieldCheck size={38} className="text-emerald-400" />
          </motion.div>
          <h2 className="mt-4 text-xl font-bold tracking-wide text-emerald-400">
            VERIFIED
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Re-scan confirms all approved fixes resolved their findings.
          </p>
        </div>
      </GlassCard>

      <div className="space-y-4">
        {results.map((r) => {
          const vuln = state.vulnerabilities.find((v) => v.id === r.vulnId);
          return (
            <GlassCard key={r.vulnId} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {vuln?.severity && (
                    <SeverityBadge severity={vuln.severity} size="sm" />
                  )}
                  <h3 className="font-semibold text-white">
                    {r.type || vuln?.type}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="rounded-full border border-red-500/40 bg-red-500/10 px-2.5 py-1 text-red-400">
                    <XCircle size={11} className="-mt-0.5 mr-1 inline" />
                    {r.before || "VULNERABLE"}
                  </span>
                  <ArrowRight size={14} className="text-slate-600" />
                  <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-emerald-400">
                    <CheckCircle2 size={11} className="-mt-0.5 mr-1 inline" />
                    {r.after || "FIXED"}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <MiniTimeline status={vuln?.status || "VERIFIED"} />
              </div>
            </GlassCard>
          );
        })}
      </div>

      <PrincipleNote>
        A passing re-scan does not mean the app is completely secure. It confirms
        this specific finding was resolved.
      </PrincipleNote>
    </div>
  );
}