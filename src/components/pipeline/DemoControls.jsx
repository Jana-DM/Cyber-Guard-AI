import { Play, RotateCcw, AlertTriangle } from 'lucide-react';
import Badge from '../shared/Badge';

const STATUS_BADGE = {
  IDLE: { color: 'slate', label: 'Idle' },
  RUNNING: { color: 'cyan', label: 'Running' },
  PAUSED_APPROVAL: { color: 'amber', label: 'Paused — Awaiting Approval' },
  COMPLETED: { color: 'emerald', label: 'Completed' },
  FAILED: { color: 'red', label: 'Failed' },
};

export default function DemoControls({ runStatus, simulateBuildFailure, onToggleFailure, onRun, onReset }) {
  const isRunning = runStatus === 'RUNNING' || runStatus === 'PAUSED_APPROVAL';
  const badge = STATUS_BADGE[runStatus] ?? STATUS_BADGE.IDLE;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge color={badge.color}>{badge.label}</Badge>

      <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer ml-1 select-none">
        <input
          type="checkbox"
          checked={simulateBuildFailure}
          onChange={onToggleFailure}
          disabled={isRunning}
          className="accent-amber-500 w-3.5 h-3.5"
        />
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
        Simulate Build/Test failure
      </label>

      <div className="flex-1" />

      <button
        onClick={onReset}
        className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 text-sm font-medium transition-colors"
      >
        <RotateCcw className="w-4 h-4" /> Reset Demo
      </button>

      <button
        onClick={onRun}
        disabled={isRunning}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyberEmerald-500 hover:bg-cyberEmerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-navy-900 text-sm font-bold transition-colors shadow-glowEmerald"
      >
        <Play className="w-4 h-4" /> Run Demo
      </button>
    </div>
  );
}