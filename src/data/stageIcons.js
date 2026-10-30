import {
  FolderGit2,
  ShieldCheck,
  Hammer,
  Rocket,
  Radar,
  FileSearch,
  Sparkles,
  UserCheck,
  Wrench,
  CheckCheck,
  GitPullRequest,
} from 'lucide-react';

// Keys must match STAGE_IDS values exactly (pipelineStages.js)
export const STAGE_ICONS = {
  source: FolderGit2,
  validation: ShieldCheck,
  build_test: Hammer,
  deployment: Rocket,
  scan: Radar,
  evidence: FileSearch,
  ai: Sparkles,
  approval: UserCheck,
  remediation: Wrench,
  verification: CheckCheck,
  github: GitPullRequest,
};