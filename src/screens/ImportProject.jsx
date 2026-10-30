import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitBranch,
  UploadCloud,
  FileCheck,
  FileX,
  Trash2,
  Plus,
  Ban,
  CheckCircle2,
  Loader2,
  Info,
  RefreshCw,
  FolderOpen,
} from "lucide-react";
import GlassCard from "../components/shared/GlassCard";

const MOCK_REPOS = [
  {
    id: "r1",
    name: "acme-corp/vulnshop-demo",
    description: "Demo e-commerce app with intentional vulnerabilities",
    branches: ["main", "feature/checkout-v2", "feature/search-revamp", "hotfix/cart-bug"],
  },
  {
    id: "r2",
    name: "acme-corp/internal-tools",
    description: "Internal tooling monorepo",
    branches: ["main", "develop", "feature/cli-upgrade"],
  },
  {
    id: "r3",
    name: "acme-corp/payments-service",
    description: "Payments microservice",
    branches: ["main", "release/2.4", "feature/webhook-retry"],
  },
];

const ALLOWED_EXTENSIONS = [
  ".js", ".jsx", ".ts", ".tsx", ".py", ".java", ".go", ".rb",
  ".php", ".json", ".yml", ".yaml", ".zip",
];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

function getExtension(name) {
  const idx = name.lastIndexOf(".");
  return idx === -1 ? "" : name.slice(idx).toLowerCase();
}

function isPathTraversal(name) {
  return (
    name.includes("..") ||
    name.startsWith("/") ||
    name.startsWith("\\") ||
    /^[a-zA-Z]:\\/.test(name) ||
    name.includes("\0")
  );
}

function validateFile(file) {
  const name = file.webkitRelativePath || file.name;

  if (isPathTraversal(name)) {
    return { ok: false, reason: "Path traversal detected" };
  }
  const ext = getExtension(name);
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return { ok: false, reason: `Unsupported file type (${ext || "none"})` };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { ok: false, reason: "Exceeds 10MB size limit" };
  }
  return { ok: true, reason: null };
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function PrincipleNote({ children }) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-4 py-3 text-xs text-cyan-200/90">
      <Info size={15} className="mt-0.5 shrink-0 text-cyan-400" />
      <p className="leading-relaxed">{children}</p>
    </div>
  );
}

function GitHubTab() {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [imported, setImported] = useState(false);
  const [importing, setImporting] = useState(false);

  const handleConnect = () => {
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
    }, 900);
  };

  const handleImport = () => {
    setImporting(true);
    setTimeout(() => {
      setImporting(false);
      setImported(true);
    }, 1100);
  };

  if (!connected) {
    return (
      <GlassCard className="flex flex-col items-center justify-center gap-4 p-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-700 bg-slate-800/60">
          <GitBranch size={26} className="text-slate-400" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Connect a repository</h3>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Simulated OAuth connection — no real GitHub account is accessed.
          </p>
        </div>
        <button
          onClick={handleConnect}
          disabled={connecting}
          className="flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-5 py-2.5 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/20 disabled:opacity-60"
        >
          {connecting ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <GitBranch size={15} />
          )}
          {connecting ? "Connecting…" : "Connect GitHub (Simulated)"}
        </button>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4">
      <GlassCard className="p-5">
        <p className="mb-3 flex items-center gap-2 text-xs font-mono uppercase tracking-wide text-emerald-400">
          <CheckCircle2 size={13} />
          Connected (Simulated)
        </p>
        <h3 className="mb-3 text-sm font-semibold text-white">Select a repository</h3>
        <div className="space-y-2">
          {MOCK_REPOS.map((repo) => (
            <button
              key={repo.id}
              onClick={() => {
                setSelectedRepo(repo);
                setSelectedBranch(null);
                setImported(false);
              }}
              className={`w-full rounded-lg border px-4 py-3 text-left transition ${
                selectedRepo?.id === repo.id
                  ? "border-cyan-500/50 bg-cyan-500/10"
                  : "border-slate-700/60 bg-slate-900/40 hover:border-slate-600"
              }`}
            >
              <p className="font-mono text-sm text-slate-200">{repo.name}</p>
              <p className="mt-0.5 text-xs text-slate-500">{repo.description}</p>
            </button>
          ))}
        </div>
      </GlassCard>

      {selectedRepo && (
        <GlassCard className="p-5">
          <h3 className="mb-3 text-sm font-semibold text-white">Select a branch</h3>
          <div className="flex flex-wrap gap-2">
            {selectedRepo.branches.map((branch) => {
              const isMain = branch === "main";
              return (
                <button
                  key={branch}
                  disabled={isMain}
                  onClick={() => !isMain && setSelectedBranch(branch)}
                  title={isMain ? "Remediation never targets main" : undefined}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-xs transition ${
                    isMain
                      ? "cursor-not-allowed border-slate-800 bg-slate-900/40 text-slate-600"
                      : selectedBranch === branch
                      ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                      : "border-slate-700 bg-slate-900/40 text-slate-300 hover:border-slate-600"
                  }`}
                >
                  {isMain && <Ban size={11} />}
                  {branch}
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-[11px] text-slate-600">
            <code className="font-mono">main</code> is disabled — remediation
            branches never target main.
          </p>
        </GlassCard>
      )}

      {selectedBranch && !imported && (
        <GlassCard className="flex items-center justify-between p-5">
          <p className="text-sm text-slate-300">
            Import <span className="font-mono text-cyan-300">{selectedRepo.name}</span>{" "}
            @ <span className="font-mono text-emerald-300">{selectedBranch}</span>
          </p>
          <button
            onClick={handleImport}
            disabled={importing}
            className="flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/20 disabled:opacity-60"
          >
            {importing ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            {importing ? "Importing…" : "Import Project"}
          </button>
        </GlassCard>
      )}

      {imported && (
        <PrincipleNote>
          Project imported (Simulated Demo Mode). Head to the Pipeline screen
          to run the full scan-to-verification workflow.
        </PrincipleNote>
      )}
    </div>
  );
}

function DropFolderTab() {
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [imported, setImported] = useState(false);
  const [importing, setImporting] = useState(false);

  const addFiles = useCallback((fileList) => {
    const incoming = Array.from(fileList).map((file) => {
      const result = validateFile(file);
      return {
        id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 8)}`,
        name: file.webkitRelativePath || file.name,
        size: file.size,
        accepted: result.ok,
        reason: result.reason,
      };
    });
    setFiles((prev) => [...prev, ...incoming]);
    setImported(false);
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const handleBrowse = (e) => {
    if (e.target.files?.length) addFiles(e.target.files);
    e.target.value = "";
  };

  const addSimulatedTraversal = () => {
    const fakeFiles = [
      { id: `fake-${Date.now()}-1`, name: "../../../etc/passwd", size: 512, accepted: false, reason: "Path traversal detected" },
      { id: `fake-${Date.now()}-2`, name: "config/../../secrets.env", size: 1024, accepted: false, reason: "Path traversal detected" },
    ];
    setFiles((prev) => [...prev, ...fakeFiles]);
    setImported(false);
  };

  const removeFile = (id) => setFiles((prev) => prev.filter((f) => f.id !== id));
  const clearAll = () => {
    setFiles([]);
    setImported(false);
  };

  const acceptedCount = files.filter((f) => f.accepted).length;

  const handleImport = () => {
    setImporting(true);
    setTimeout(() => {
      setImporting(false);
      setImported(true);
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center transition ${
          dragging
            ? "border-cyan-400 bg-cyan-500/5"
            : "border-slate-700 bg-slate-900/30"
        }`}
      >
        <UploadCloud
          size={32}
          className={dragging ? "text-cyan-400" : "text-slate-500"}
        />
        <p className="text-sm text-slate-300">
          Drag & drop project files here, or
        </p>
        <label className="cursor-pointer rounded-lg border border-slate-600 bg-slate-800/60 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-500/50">
          Browse files
          <input type="file" multiple className="hidden" onChange={handleBrowse} />
        </label>
        <p className="text-[11px] text-slate-600">
          Allowed: {ALLOWED_EXTENSIONS.join(", ")} · Max 10MB per file
        </p>
        <button
          onClick={addSimulatedTraversal}
          className="mt-1 flex items-center gap-1.5 text-[11px] text-amber-400/80 underline decoration-dotted hover:text-amber-300"
        >
          <RefreshCw size={11} />
          Simulate a path-traversal attempt (for demo)
        </button>
      </div>

      {files.length > 0 && (
        <GlassCard className="p-0">
          <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3">
            <p className="text-sm font-semibold text-white">
              {files.length} file{files.length !== 1 ? "s" : ""} ·{" "}
              <span className="text-emerald-400">{acceptedCount} accepted</span>
              {files.length - acceptedCount > 0 && (
                <>
                  {" "}
                  · <span className="text-red-400">{files.length - acceptedCount} rejected</span>
                </>
              )}
            </p>
            <button
              onClick={clearAll}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300"
            >
              <Trash2 size={12} />
              Clear all
            </button>
          </div>
          <div className="max-h-72 divide-y divide-slate-800/80 overflow-y-auto">
            <AnimatePresence initial={false}>
              {files.map((f) => (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-between gap-3 px-5 py-2.5"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    {f.accepted ? (
                      <FileCheck size={15} className="shrink-0 text-emerald-400" />
                    ) : (
                      <FileX size={15} className="shrink-0 text-red-400" />
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-mono text-xs text-slate-300">{f.name}</p>
                      {!f.accepted && (
                        <p className="text-[11px] text-red-400/90">{f.reason}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="font-mono text-[11px] text-slate-600">
                      {formatBytes(f.size)}
                    </span>
                    <button
                      onClick={() => removeFile(f.id)}
                      className="text-slate-600 hover:text-red-400"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </GlassCard>
      )}

      {acceptedCount > 0 && !imported && (
        <GlassCard className="flex items-center justify-between p-5">
          <p className="text-sm text-slate-300">
            Ready to import {acceptedCount} validated file
            {acceptedCount !== 1 ? "s" : ""}.
          </p>
          <button
            onClick={handleImport}
            disabled={importing}
            className="flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/20 disabled:opacity-60"
          >
            {importing ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            {importing ? "Importing…" : "Import Files"}
          </button>
        </GlassCard>
      )}

      {imported && (
        <PrincipleNote>
          {acceptedCount} file{acceptedCount !== 1 ? "s" : ""} imported into the
          VulnShop Demo workspace (Simulated Demo Mode). Head to the Pipeline
          screen to run the full scan-to-verification workflow.
        </PrincipleNote>
      )}
    </div>
  );
}

export default function ImportProject() {
  const [tab, setTab] = useState("github");

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-bold text-white">Import Project</h1>
          <span className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wide text-cyan-400">
            Simulated Demo Mode
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-400">
          Connect a repository or drop local files to begin a security review.
        </p>
      </div>

      <div className="flex gap-2 border-b border-slate-800">
        <button
          onClick={() => setTab("github")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition ${
            tab === "github"
              ? "border-cyan-400 text-cyan-300"
              : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          <GitBranch size={15} />
          GitHub
        </button>
        <button
          onClick={() => setTab("folder")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition ${
            tab === "folder"
              ? "border-cyan-400 text-cyan-300"
              : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          <FolderOpen size={15} />
          Drop Folder
        </button>
      </div>

      {tab === "github" ? <GitHubTab /> : <DropFolderTab />}
    </div>
  );
}