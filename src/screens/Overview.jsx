import { useMemo } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Activity,
  Clock,
  Gauge,
  GitBranch,
  Server,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Info,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useDemo } from "../context/DemoContext";
import GlassCard from "../components/shared/GlassCard";

const SEVERITY_COLORS = {
  CRITICAL: "#f87171",
  HIGH: "#fb923c",
  MEDIUM: "#fbbf24",
  LOW: "#22d3ee",
  INFO: "#94a3b8",
};

const RUN_STATUS_META = {
  IDLE: { label: "Idle", color: "text-slate-400", bg: "bg-slate-800/50 border-slate-700" },
  RUNNING: { label: "Running", color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/40" },
  PAUSED_APPROVAL: { label: "Paused — Approval needed", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/40" },
  COMPLETED: { label: "Completed", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/40" },
  FAILED: { label: "Failed", color: "text-red-400", bg: "bg-red-500/10 border-red-500/40" },
};

function formatTime(ts) {
  if (!ts) return null;
  try {
    return new Date(ts).toLocaleString([], {
      hour12: false,
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return null;
  }
}

function SampleTag() {
  return (
    <span className="rounded border border-slate-600 bg-slate-800/80 px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wide text-slate-400">
      Sample
    </span>
  );
}

function StatCard({ icon: Icon, label, value, accent = "text-cyan-400", sub }) {
  return (
    <GlassCard className="flex items-center gap-4 p-5">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-800/80 ${accent}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
        <p className="mt-0.5 truncate text-lg font-bold text-white">{value}</p>
        {sub && <p className="mt-0.5 text-xs text-slate-500">{sub}</p>}
      </div>
    </GlassCard>
  );
}

export default function Overview() {
  const { state } = useDemo();

  const vulns = state.vulnerabilities || [];
  const verifiedCount = vulns.filter((v) => v.status === "VERIFIED").length;
  const openCount = vulns.length - verifiedCount;

  const severityData = useMemo(() => {
    const counts = {};
    vulns.forEach((v) => {
      const sev = (v.severity || "INFO").toUpperCase();
      counts[sev] = (counts[sev] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [vulns]);

  const runMeta = RUN_STATUS_META[state.runStatus] || RUN_STATUS_META.IDLE;
  const lastScanTime = formatTime(state.stages?.scan?.endedAt);
  const verificationDone = state.verification?.status === "DONE";

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-12">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-white">VulnShop Demo</h1>
            <span className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wide text-cyan-400">
              Simulated Demo Mode
            </span>
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
            <GitBranch size={13} />
            acme-corp/vulnshop-demo
            <span className="text-slate-600">·</span>
            feature/checkout-v2
          </p>
        </div>
        <span
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-mono uppercase tracking-wide ${runMeta.bg} ${runMeta.color}`}
        >
          <Activity size={13} />
          {runMeta.label}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Server}
          label="Target"
          value="VulnShop Demo"
          accent="text-cyan-400"
          sub="Authorized mock application"
        />
        <StatCard
          icon={ShieldAlert}
          label="Open Vulnerabilities"
          value={openCount}
          accent="text-amber-400"
          sub={`${vulns.length} total findings`}
        />
        <StatCard
          icon={ShieldCheck}
          label="Verified Fixes"
          value={verifiedCount}
          accent="text-emerald-400"
          sub={verificationDone ? "Re-scan confirmed" : "Pending re-scan"}
        />
        <StatCard
          icon={Clock}
          label="Last Scan"
          value={lastScanTime || "Not yet run"}
          accent="text-slate-300"
          sub={lastScanTime ? "Most recent scan stage" : "Run the demo pipeline"}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <GlassCard className="p-6 lg:col-span-2">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
            <Gauge size={16} className="text-cyan-400" />
            Severity Breakdown
          </h3>
          {severityData.length === 0 ? (
            <div className="flex h-56 flex-col items-center justify-center text-center text-sm text-slate-500">
              <Info size={24} className="mb-2 text-slate-600" />
              No findings yet. Run the demo pipeline to populate results.
            </div>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={82}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {severityData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={SEVERITY_COLORS[entry.name] || "#94a3b8"}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#0f172a",
                      border: "1px solid #334155",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={28}
                    wrapperStyle={{ fontSize: 11, color: "#94a3b8" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-6 lg:col-span-3">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
            <ShieldCheck size={16} className="text-emerald-400" />
            Verification Status
          </h3>
          {!verificationDone ? (
            <div className="flex h-48 flex-col items-center justify-center text-center text-sm text-slate-500">
              <XCircle size={24} className="mb-2 text-slate-600" />
              No verification completed yet.
              <span className="mt-1 text-xs text-slate-600">
                Approve a fix in the pipeline and let it reach Verification.
              </span>
            </div>
          ) : (
            <div className="space-y-3">
              {(state.verification.results || []).map((r) => {
                const vuln = vulns.find((v) => v.id === r.vulnId);
                return (
                  <div
                    key={r.vulnId}
                    className="flex items-center justify-between rounded-lg border border-slate-700/60 bg-slate-900/50 px-4 py-3"
                  >
                    <span className="text-sm text-slate-200">
                      {r.type || vuln?.type}
                    </span>
                    <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-mono uppercase text-emerald-400">
                      <CheckCircle2 size={11} />
                      {r.after || "FIXED"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
          <TrendingUp size={16} className="text-cyan-400" />
          Performance Metrics
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-700/60 bg-slate-900/50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Scan Time
              </p>
              <SampleTag />
            </div>
            <p className="mt-1 text-xl font-bold text-white">4m 12s</p>
          </div>
          <div className="rounded-lg border border-slate-700/60 bg-slate-900/50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Fix Cycle Time
              </p>
              <SampleTag />
            </div>
            <p className="mt-1 text-xl font-bold text-white">2m 48s</p>
          </div>
          <div className="rounded-lg border border-slate-700/60 bg-slate-900/50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Verification Success
              </p>
              <SampleTag />
            </div>
            <p className="mt-1 text-xl font-bold text-white">100%</p>
          </div>
        </div>
        <p className="mt-4 text-xs text-slate-600">
          Sample values shown for demo purposes. Timings reflect the simulated
          pipeline run, not production benchmarks.
        </p>
      </GlassCard>
    </div>
  );
}