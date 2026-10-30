import { nextId } from '../utils/id';
import { isoNow } from '../utils/time';

export const AUDIT_ACTION = {
  PIPELINE_STARTED: 'PIPELINE_STARTED',
  PIPELINE_RESET: 'PIPELINE_RESET',
  STAGE_FAILED: 'STAGE_FAILED',
  FINDING_VALIDATED: 'FINDING_VALIDATED',
  CANDIDATE_REJECTED: 'CANDIDATE_REJECTED',
  FIX_APPROVED: 'FIX_APPROVED',
  FIX_REJECTED: 'FIX_REJECTED',
  REMEDIATION_APPLIED: 'REMEDIATION_APPLIED',
  VERIFICATION_PASSED: 'VERIFICATION_PASSED',
  VERIFICATION_FAILED: 'VERIFICATION_FAILED',
  GIT_BRANCH_CREATED: 'GIT_BRANCH_CREATED',
  GIT_COMMIT: 'GIT_COMMIT',
  GIT_PUSH: 'GIT_PUSH',
};

export function createAuditEvent({ user, action, result, details }) {
  return {
    id: nextId('audit'),
    timestamp: isoNow(),
    user,
    action,
    result, // 'SUCCESS' | 'FAILED' | 'INFO'
    details,
  };
}