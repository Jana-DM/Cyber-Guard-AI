export const SEVERITY = {
  CRITICAL: 'CRITICAL',
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
  INFO: 'INFO',
};

export const SEVERITY_ORDER = [
  SEVERITY.CRITICAL,
  SEVERITY.HIGH,
  SEVERITY.MEDIUM,
  SEVERITY.LOW,
  SEVERITY.INFO,
];

// Tailwind-friendly hex + class tokens, reused by badges and the donut chart
export const SEVERITY_META = {
  CRITICAL: { label: 'Critical', hex: '#f43f5e', badge: 'red' },
  HIGH: { label: 'High', hex: '#f97316', badge: 'amber' },
  MEDIUM: { label: 'Medium', hex: '#eab308', badge: 'amber' },
  LOW: { label: 'Low', hex: '#38bdf8', badge: 'cyan' },
  INFO: { label: 'Info', hex: '#94a3b8', badge: 'slate' },
};