import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertOctagon, Info } from 'lucide-react';
import { useDemo } from '../context/DemoContext';
import GlassCard from '../components/shared/GlassCard';
import LogTerminal from '../components/shared/LogTerminal';
import StatusChip from '../components/shared/StatusChip';
import PipelineTrack from '../components/pipeline/PipelineTrack';
import DemoControls from '../components/pipeline/DemoControls';
import ApprovalPanel from '../components/pipeline/ApprovalPanel';
import { PIPELINE_STAGES } from '../data/pipelineStages';
import Badge from '../components/shared/Badge';

export default function Pipeline() {
  const { state, runDemo, resetDemo, decideFix, approveAll, toggleSimulateFailure } = useDemo();
  const [selectedStageId, setSelectedStageId] = useState(null);

  useEffect(() => {
    if (state.currentStageId) setSelectedStageId(state.currentStageId);
  }, [state.currentStageId]);

  const selectedStage = PIPELINE_STAGES.find((s) => s.id === selectedStageId);
  const selectedStageState = selectedStageId ? state.stages[selectedStageId] : null;
  const failedStage = PIPELINE_STAGES.find((s) => state.stages[s.id].status === 'FAILED');

  return (
    <div className="space-y-6">
      <GlassCard className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white">Security Pipeline</h1>
            <p className="text-sm text-slate-400 mt-1">
              Source → Validation → Build/Test → Deployment → Scan → Evidence → AI → Approval → Remediation → Verification → GitHub
            </p>
          </div>
          <Badge color="slate">Target: VulnShop Demo (Simulated)</Badge>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <DemoControls
          runStatus={state.runStatus}
          simulateBuildFailure={state.simulateBuildFailure}
          onToggleFailure={toggleSimulateFailure}
          onRun={runDemo}
          onReset={resetDemo}
        />
      </GlassCard>

      <GlassCard className="p-6 overflow-hidden">
        <PipelineTrack stages={state.stages} selectedStageId={selectedStageId} onSelectStage={setSelectedStageId} />
      </GlassCard>

      {state.runStatus === 'FAILED' && failedStage && (
        <GlassCard className="p-5 border border-rose-500/40 shadow-glowRed">
          <div className="flex items-start gap-3">
            <AlertOctagon className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-rose-300 font-bold">Pipeline halted at {failedStage.label}</h3>
              <p className="text-sm text-slate-400 mt-1">
                Build/Test failed, so no deployment or scan was performed. This demonstrates the pipeline's
                fail-closed behavior — a broken build never reaches a live scan.
              </p>
            </div>
          </div>
        </GlassCard>
      )}

      <AnimatePresence>
        {state.runStatus === 'PAUSED_APPROVAL' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <ApprovalPanel vulnerabilities={state.vulnerabilities} onDecide={decideFix} onApproveAll={approveAll} />
          </motion.div>
        )}
      </AnimatePresence>

      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-white font-semibold text-sm">
              {selectedStage ? `${selectedStage.order}. ${selectedStage.label}` : 'Stage Log'}
            </h3>
            {selectedStage && <p className="text-xs text-slate-500 mt-0.5">{selectedStage.description}</p>}
          </div>
          {selectedStageState && <StatusChip status={selectedStageState.status} />}
        </div>
        <LogTerminal
          lines={selectedStageState?.logs ?? []}
          emptyLabel="Click Run Demo to start the pipeline, or select a stage to inspect its log."
        />
      </GlassCard>

      <GlassCard className="p-4 border border-cyberCyan-500/20">
        <div className="flex items-start gap-2.5 text-xs text-slate-400">
          <Info className="w-4 h-4 text-cyberCyan-400 shrink-0 mt-0.5" />
          <span>
            <span className="text-cyberCyan-300 font-medium">Simulated Demo Mode:</span> all stages, deployments,
            scans, and GitHub operations shown here are simulated against an authorized mock target. No real
            infrastructure or repository is affected.
          </span>
        </div>
      </GlassCard>
    </div>
  );
}