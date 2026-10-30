import {
  LayoutDashboard,
  FolderGit2,
  GitBranch,
  Bug,
  ShieldCheck,
  GitPullRequest,
  ScrollText,
} from 'lucide-react';

export const ROUTES = {
  OVERVIEW: 'overview',
  IMPORT: 'import',
  PIPELINE: 'pipeline',
  SCAN_RESULTS: 'scan-results',
  VERIFICATION: 'verification',
  GITHUB: 'github',
  AUDIT_LOG: 'audit-log',
};

export const NAV_ITEMS = [
  { id: ROUTES.OVERVIEW, label: 'Overview', icon: LayoutDashboard },
  { id: ROUTES.IMPORT, label: 'Import Project', icon: FolderGit2 },
  { id: ROUTES.PIPELINE, label: 'Pipeline', icon: GitBranch },
  { id: ROUTES.SCAN_RESULTS, label: 'Scan Results', icon: Bug },
  { id: ROUTES.VERIFICATION, label: 'Verification', icon: ShieldCheck },
  { id: ROUTES.GITHUB, label: 'GitHub', icon: GitPullRequest },
  { id: ROUTES.AUDIT_LOG, label: 'Audit Log', icon: ScrollText },
];