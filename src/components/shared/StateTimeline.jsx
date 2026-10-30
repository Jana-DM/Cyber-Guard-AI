import { CheckCircle2, Circle, XCircle } from 'lucide-react';
import { VULN_STATE_ORDER, VULN_STATE } from '../../constants/status';
import { formatTimestamp } from '../../utils/time';

const LABELS = {
  [VULN_STATE.DETECTED]: 'Detected',
  [VULN_STATE.VALIDATED]: 'Validated',
  [VULN_STATE.FIX_PROPOSED]: 'Fix Proposed',
  [VULN_STATE.APPROVED]: 'Approved',
  [VULN_STATE.FIX_APPLIED]: 'Fix Applied',
  [VULN_STATE.RESCAN]: 'Re-scan',
  [VULN_STATE.VERIFIED]: 'Verified',
};

export default function StateTimeline({ stateHistory, currentStatus }) {
  const failed = currentStatus === VULN_STATE.UNRESOLVED || currentStatus === VULN_STATE.TEST_FAILED;
  const historyMap = Object.fromEntries(stateHistory.map((h) => [h.state, h]));
  const currentIndex = VULN_STATE_ORDER.indexOf(currentStatus);

  return (
    <div className="flex items-start overflow-x-auto pb-1">
      {VULN_STATE_ORDER.map((stateName, idx) => {
        const reached = historyMap[stateName] != null;
        const isCurrent = stateName === currentStatus;
        const isPast = currentIndex > idx;
        let Icon = Circle;
        let color = 'text-slate-600 border-slate-700';
        if (reached && (isPast || isCurrent)) {
          Icon = CheckCircle2;
          color = 'text-cyberEmerald-400 border-cyberEmerald-500/40';
        }
        if (isCurrent && failed) {
          Icon = XCircle;
          color = 'text-rose-400 border-rose-500/40';
        }
        return (
          <div key={stateName} className="flex items-center">
            <div className="flex flex-col items-center min-w-[84px]">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center bg-navy-900/80 ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-[10px] text-slate-400 mt-1.5 text-center font-medium">{LABELS[stateName]}</div>
              <div className="text-[9px] text-slate-600 font-mono mt-0.5">
                {historyMap[stateName] ? formatTimestamp(historyMap[stateName].timestamp) : '—'}
              </div>
            </div>
            {idx < VULN_STATE_ORDER.length - 1 && (
              <div className={`h-0.5 w-6 md:w-9 mt-4 ${reached ? 'bg-cyberEmerald-500/40' : 'bg-slate-800'}`} />
            )}
          </div>
        );
      })}
      {failed && (
        <div className="flex flex-col items-center min-w-[84px] ml-1">
          <div className="w-8 h-8 rounded-full border-2 border-rose-500/40 flex items-center justify-center bg-navy-900/80 text-rose-400">
            <XCircle className="w-4 h-4" />
          </div>
          <div className="text-[10px] text-rose-400 mt-1.5 text-center font-medium">Unresolved</div>
        </div>
      )}
    </div>
  );
}