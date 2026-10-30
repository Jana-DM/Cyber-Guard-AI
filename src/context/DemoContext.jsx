import { createContext, useContext, useReducer, useRef, useEffect, useCallback } from 'react';
import { PIPELINE_STAGES, BUILD_TEST_FAILURE_LOGS, STAGE_IDS } from '../data/pipelineStages';
import { VULNERABILITIES, REJECTED_CANDIDATES } from '../data/vulnerabilities';
import { GITHUB_WORKFLOW } from '../data/github';
import { AUDIT_ACTION, createAuditEvent } from '../data/auditLog';
import { STAGE_STATUS, VULN_STATE } from '../constants/status';
import { deepClone } from '../utils/clone';
import { createRunController, CancelledError } from '../utils/simulation';

function createInitialStages() {
  return Object.fromEntries(
    PIPELINE_STAGES.map((s) => [
      s.id,
      { status: STAGE_STATUS.PENDING, logs: [], durationMs: null, startedAt: null, endedAt: null },
    ])
  );
}

function createInitialState() {
  return {
    runStatus: 'IDLE', // IDLE | RUNNING | PAUSED_APPROVAL | COMPLETED | FAILED
    simulateBuildFailure: false,
    currentStageId: null,
    stages: createInitialStages(),
    vulnerabilities: deepClone(VULNERABILITIES),
    rejectedCandidates: deepClone(REJECTED_CANDIDATES),
    auditLog: [],
    github: { status: 'NOT_STARTED' },
    verification: { status: 'NOT_STARTED', results: [] },
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'RESET':
      return { ...createInitialState(), simulateBuildFailure: state.simulateBuildFailure };

    case 'TOGGLE_SIMULATE_FAILURE':
      return { ...state, simulateBuildFailure: !state.simulateBuildFailure };

    case 'SET_RUN_STATUS':
      return { ...state, runStatus: action.payload };

    case 'SET_CURRENT_STAGE':
      return { ...state, currentStageId: action.payload };

    case 'STAGE_START':
      return {
        ...state,
        stages: {
          ...state.stages,
          [action.payload]: {
            ...state.stages[action.payload],
            status: STAGE_STATUS.RUNNING,
            logs: [],
            startedAt: Date.now(),
            durationMs: null,
          },
        },
      };

    case 'STAGE_LOG': {
      const { stageId, line } = action.payload;
      return {
        ...state,
        stages: {
          ...state.stages,
          [stageId]: { ...state.stages[stageId], logs: [...state.stages[stageId].logs, line] },
        },
      };
    }

    case 'STAGE_FINISH': {
      const { stageId, status, durationMs } = action.payload;
      return {
        ...state,
        stages: {
          ...state.stages,
          [stageId]: { ...state.stages[stageId], status, durationMs, endedAt: Date.now() },
        },
      };
    }

    case 'VULN_SET_STATE': {
      const { vulnId, state: newState, actor } = action.payload;
      return {
        ...state,
        vulnerabilities: state.vulnerabilities.map((v) =>
          v.id === vulnId
            ? { ...v, status: newState, stateHistory: [...v.stateHistory, { state: newState, timestamp: Date.now(), actor }] }
            : v
        ),
      };
    }

    case 'VULN_DECISION': {
      const { vulnId, decision } = action.payload;
      const newState = decision === 'APPROVED' ? VULN_STATE.APPROVED : VULN_STATE.UNRESOLVED;
      return {
        ...state,
        vulnerabilities: state.vulnerabilities.map((v) =>
          v.id === vulnId
            ? { ...v, status: newState, stateHistory: [...v.stateHistory, { state: newState, timestamp: Date.now(), actor: 'demo.analyst' }] }
            : v
        ),
      };
    }

    case 'AUDIT_ADD':
      return { ...state, auditLog: [action.payload, ...state.auditLog] };

    case 'GITHUB_UPDATE':
      return { ...state, github: { ...state.github, ...action.payload } };

    case 'VERIFICATION_SET':
      return { ...state, verification: action.payload };

    default:
      return state;
  }
}

const DemoContext = createContext(null);

export function DemoProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const stateRef = useRef(state);
  const controllerRef = useRef(null);
  const approvalGateRef = useRef(null);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Auto-resolve the approval gate once every vulnerability has a decision.
  useEffect(() => {
    if (state.runStatus !== 'PAUSED_APPROVAL') return;
    const allDecided = state.vulnerabilities.every(
      (v) => v.status === VULN_STATE.APPROVED || v.status === VULN_STATE.UNRESOLVED
    );
    if (allDecided && approvalGateRef.current) {
      approvalGateRef.current.resolve();
      approvalGateRef.current = null;
    }
  }, [state.vulnerabilities, state.runStatus]);

  function waitForApproval() {
    return new Promise((resolve, reject) => {
      approvalGateRef.current = { resolve, reject };
    });
  }

  function markRemainingSkipped(fromStageId) {
    const fromOrder = PIPELINE_STAGES.find((s) => s.id === fromStageId).order;
    PIPELINE_STAGES.filter((s) => s.order > fromOrder).forEach((s) => {
      dispatch({ type: 'STAGE_FINISH', payload: { stageId: s.id, status: STAGE_STATUS.SKIPPED, durationMs: null } });
    });
  }

  const runDemo = useCallback(async () => {
    if (stateRef.current.runStatus === 'RUNNING' || stateRef.current.runStatus === 'PAUSED_APPROVAL') return;

    dispatch({ type: 'RESET' });
    const controller = createRunController();
    controllerRef.current = controller;
    dispatch({ type: 'SET_RUN_STATUS', payload: 'RUNNING' });

    try {
      for (const stage of PIPELINE_STAGES) {
        dispatch({ type: 'SET_CURRENT_STAGE', payload: stage.id });
        dispatch({ type: 'STAGE_START', payload: stage.id });

        const useFailureLogs = stage.id === STAGE_IDS.BUILD_TEST && stateRef.current.simulateBuildFailure;
        const logs = useFailureLogs ? BUILD_TEST_FAILURE_LOGS : stage.logs;
        const start = Date.now();

        for (const line of logs) {
          dispatch({ type: 'STAGE_LOG', payload: { stageId: stage.id, line: line.text } });
          await controller.sleep(line.delay);
        }

        if (useFailureLogs) {
          const duration = Date.now() - start;
          dispatch({ type: 'STAGE_FINISH', payload: { stageId: stage.id, status: STAGE_STATUS.FAILED, durationMs: duration } });
          dispatch({ type: 'SET_RUN_STATUS', payload: 'FAILED' });
          dispatch({
            type: 'AUDIT_ADD',
            payload: createAuditEvent({
              user: 'cyberguard-ci',
              action: AUDIT_ACTION.STAGE_FAILED,
              result: 'FAILED',
              details: 'Build/Test failed — pipeline halted before deployment and scan.',
            }),
          });
          markRemainingSkipped(stage.id);
          return;
        }

        if (stage.id === STAGE_IDS.APPROVAL) {
          dispatch({ type: 'SET_RUN_STATUS', payload: 'PAUSED_APPROVAL' });
          await waitForApproval();
          dispatch({ type: 'SET_RUN_STATUS', payload: 'RUNNING' });
        }

        const duration = Date.now() - start;
        dispatch({ type: 'STAGE_FINISH', payload: { stageId: stage.id, status: STAGE_STATUS.SUCCESS, durationMs: duration } });

        if (stage.id === STAGE_IDS.EVIDENCE) {
          VULNERABILITIES.forEach((v) => {
            dispatch({ type: 'VULN_SET_STATE', payload: { vulnId: v.id, state: VULN_STATE.VALIDATED, actor: 'cyberguard-evidence-engine' } });
            dispatch({
              type: 'AUDIT_ADD',
              payload: createAuditEvent({ user: 'cyberguard-evidence-engine', action: AUDIT_ACTION.FINDING_VALIDATED, result: 'SUCCESS', details: `${v.type} validated with live evidence` }),
            });
          });
          REJECTED_CANDIDATES.forEach((c) => {
            dispatch({
              type: 'AUDIT_ADD',
              payload: createAuditEvent({ user: 'cyberguard-evidence-engine', action: AUDIT_ACTION.CANDIDATE_REJECTED, result: 'INFO', details: `${c.type} failed validation — ${c.reason}` }),
            });
          });
        }

        if (stage.id === STAGE_IDS.AI) {
          VULNERABILITIES.forEach((v) => {
            dispatch({ type: 'VULN_SET_STATE', payload: { vulnId: v.id, state: VULN_STATE.FIX_PROPOSED, actor: 'cyberguard-ai' } });
          });
        }

        if (stage.id === STAGE_IDS.REMEDIATION) {
          const approved = stateRef.current.vulnerabilities.filter((v) => v.status === VULN_STATE.APPROVED);
          approved.forEach((v) => {
            dispatch({ type: 'VULN_SET_STATE', payload: { vulnId: v.id, state: VULN_STATE.FIX_APPLIED, actor: 'cyberguard-remediation-engine' } });
            dispatch({
              type: 'AUDIT_ADD',
              payload: createAuditEvent({ user: 'cyberguard-remediation-engine', action: AUDIT_ACTION.REMEDIATION_APPLIED, result: 'SUCCESS', details: `Applied fix for ${v.type} on isolated branch copy` }),
            });
          });
        }

        if (stage.id === STAGE_IDS.VERIFICATION) {
          const toVerify = stateRef.current.vulnerabilities.filter((v) => v.status === VULN_STATE.FIX_APPLIED);
          toVerify.forEach((v) => {
            dispatch({ type: 'VULN_SET_STATE', payload: { vulnId: v.id, state: VULN_STATE.RESCAN, actor: 'cyberguard-scanner' } });
          });
          await controller.sleep(250);
          const results = [];
          toVerify.forEach((v) => {
            dispatch({ type: 'VULN_SET_STATE', payload: { vulnId: v.id, state: VULN_STATE.VERIFIED, actor: 'cyberguard-scanner' } });
            dispatch({
              type: 'AUDIT_ADD',
              payload: createAuditEvent({ user: 'cyberguard-scanner', action: AUDIT_ACTION.VERIFICATION_PASSED, result: 'SUCCESS', details: `Re-scan confirms ${v.type} is resolved` }),
            });
            results.push({ vulnId: v.id, type: v.type, before: 'VULNERABLE', after: 'FIXED' });
          });
          dispatch({ type: 'VERIFICATION_SET', payload: { status: 'DONE', results } });
        }
      }

      dispatch({ type: 'GITHUB_UPDATE', payload: { status: 'DONE' } });
      dispatch({ type: 'AUDIT_ADD', payload: createAuditEvent({ user: 'cyberguard-ci', action: AUDIT_ACTION.GIT_BRANCH_CREATED, result: 'SUCCESS', details: `Branch ${GITHUB_WORKFLOW.branch} created from ${GITHUB_WORKFLOW.baseBranch}` }) });
      dispatch({ type: 'AUDIT_ADD', payload: createAuditEvent({ user: 'cyberguard-ci', action: AUDIT_ACTION.GIT_COMMIT, result: 'SUCCESS', details: `Commit ${GITHUB_WORKFLOW.commitHashShort} created` }) });
      dispatch({ type: 'AUDIT_ADD', payload: createAuditEvent({ user: 'cyberguard-ci', action: AUDIT_ACTION.GIT_PUSH, result: 'SUCCESS', details: `Pushed ${GITHUB_WORKFLOW.branch} (never main) — ready for review` }) });
      dispatch({ type: 'SET_RUN_STATUS', payload: 'COMPLETED' });
    } catch (err) {
      if (!(err instanceof CancelledError)) {
        console.error('Pipeline run error:', err);
      }
      // CancelledError is expected on Reset — state was already reset by resetDemo().
    }
  }, []);

  const resetDemo = useCallback(() => {
    controllerRef.current?.cancel();
    approvalGateRef.current?.reject(new CancelledError());
    approvalGateRef.current = null;
    dispatch({ type: 'RESET' });
  }, []);

  const decideFix = useCallback((vulnId, decision) => {
    const vuln = stateRef.current.vulnerabilities.find((v) => v.id === vulnId);
    dispatch({ type: 'VULN_DECISION', payload: { vulnId, decision } });
    dispatch({
      type: 'AUDIT_ADD',
      payload: createAuditEvent({
        user: 'demo.analyst',
        action: decision === 'APPROVED' ? AUDIT_ACTION.FIX_APPROVED : AUDIT_ACTION.FIX_REJECTED,
        result: decision === 'APPROVED' ? 'SUCCESS' : 'INFO',
        details: `${decision === 'APPROVED' ? 'Approved' : 'Rejected'} fix for ${vuln?.type ?? vulnId}`,
      }),
    });
  }, []);

  const approveAll = useCallback(() => {
    stateRef.current.vulnerabilities
      .filter((v) => v.status === VULN_STATE.FIX_PROPOSED)
      .forEach((v) => decideFix(v.id, 'APPROVED'));
  }, [decideFix]);

  const toggleSimulateFailure = useCallback(() => {
    dispatch({ type: 'TOGGLE_SIMULATE_FAILURE' });
  }, []);

  const value = { state, runDemo, resetDemo, decideFix, approveAll, toggleSimulateFailure };

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo must be used within DemoProvider');
  return ctx;
}