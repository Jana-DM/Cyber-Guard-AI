import { VULN_STATE } from '../../constants/status';
import Badge from './Badge';

const META = {
  [VULN_STATE.DETECTED]: { label: 'Detected', color: 'slate' },
  [VULN_STATE.VALIDATED]: { label: 'Validated', color: 'cyan' },
  [VULN_STATE.FIX_PROPOSED]: { label: 'Fix Proposed', color: 'amber' },
  [VULN_STATE.APPROVED]: { label: 'Approved', color: 'emerald' },
  [VULN_STATE.REJECTED]: { label: 'Rejected', color: 'red' },
  [VULN_STATE.FIX_APPLIED]: { label: 'Fix Applied', color: 'emerald' },
  [VULN_STATE.RESCAN]: { label: 'Re-scanning', color: 'cyan' },
  [VULN_STATE.VERIFIED]: { label: 'Verified', color: 'emerald' },
  [VULN_STATE.TEST_FAILED]: { label: 'Test Failed', color: 'red' },
  [VULN_STATE.UNRESOLVED]: { label: 'Unresolved', color: 'red' },
};

export default function VulnStateBadge({ state, className = '' }) {
  const meta = META[state] ?? { label: state, color: 'slate' };
  return (
    <Badge color={meta.color} className={className}>
      {meta.label}
    </Badge>
  );
}