import { Circle } from 'lucide-react';
import { motion } from 'framer-motion';
import { STAGE_ICONS } from '../../data/stageIcons';
import { formatDuration } from '../../utils/time';

const STATUS_RING = {
  PENDING: 'border-slate-700 text-slate-500',
  RUNNING: 'border-cyberCyan-400 text-cyberCyan-300 shadow-glowCyan',
  SUCCESS: 'border-cyberEmerald-400 text-cyberEmerald-300 shadow-glowEmerald',
  FAILED: 'border-rose-500 text-rose-400 shadow-glowRed',
  SKIPPED: 'border-slate-800 text-slate-600',
};

export default function StageNode({ stage, status, durationMs, isSelected, onClick }) {
  const Icon = STAGE_ICONS[stage.id] || Circle;
  const ring = STATUS_RING[status] ?? STATUS_RING.PENDING;

  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2 min-w-[92px] group">
      <motion.div
        animate={status === 'RUNNING' ? { scale: [1, 1.08, 1] } : { scale: 1 }}
        transition={status === 'RUNNING' ? { duration: 1.4, repeat: Infinity } : {}}
        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center bg-navy-900/80 transition-colors ${ring}
          ${isSelected ? 'ring-2 ring-offset-2 ring-offset-navy-900 ring-cyberCyan-400/60' : ''}`}
      >
        <Icon className="w-5 h-5" />
      </motion.div>
      <div className="text-center">
        <div className={`text-[11px] font-semibold ${isSelected ? 'text-white' : 'text-slate-400'} group-hover:text-white transition-colors`}>
          {stage.order}. {stage.label}
        </div>
        <div className="text-[10px] text-slate-600 font-mono mt-0.5">
          {durationMs != null ? formatDuration(durationMs) : '—'}
        </div>
      </div>
    </button>
  );
}