import { useState } from 'react';
import { ShieldAlert, Radar } from 'lucide-react';
import { useDemo } from '../context/DemoContext';
import GlassCard from '../components/shared/GlassCard';
import Badge from '../components/shared/Badge';
import FindingsTable from '../components/scan/FindingsTable';
import RejectedCandidatesSection from '../components/scan/RejectedCandidatesSection';
import VulnerabilityDetail from '../components/scan/VulnerabilityDetail';
import { VULN_STATE } from '../constants/status';

export default function ScanResults() {
  const { state, decideFix } = useDemo();
  const [selectedId, setSelectedId] = useState(null);

  const selectedVuln = state.vulnerabilities.find((v) => v.id === selectedId);
  const hasValidatedFindings = state.vulnerabilities.some((v) => v.status !== VULN_STATE.DETECTED);

  if (selectedVuln) {
    return <VulnerabilityDetail vuln={selectedVuln} onBack={() => setSelectedId(null)} onDecide={decideFix} />;
  }

  if (!hasValidatedFindings) {
    const failedBeforeScan = state.runStatus === 'FAILED';
    return (
      <GlassCard className="p-10 flex flex-col items-center text-center gap-3">
        <div className="p-3 rounded-full bg-slate-500/10 border border-slate-700">
          <Radar className="w-6 h-6 text-slate-500" />
        </div>
        <h2 className="text-white font-bold">
          {failedBeforeScan ? 'Pipeline halted before scan' : 'No scan results yet'}
        </h2>
        <p className="text-sm text-slate-500 max-w-sm">
          {failedBeforeScan
            ? 'Build/Test failed, so the pipeline never reached the Scan stage. No findings were generated.'
            : 'Run the demo from the Pipeline screen to generate validated findings and evidence.'}
        </p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      <GlassCard className="p-6">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">Scan Results</h1>
            <p className="text-sm text-slate-400 mt-1">
              Findings validated with live evidence — click any row to inspect evidence, AI explanation, and the
              proposed fix.
            </p>
          </div>
          <Badge color="emerald">{state.vulnerabilities.length} Validated Findings</Badge>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Validated Vulnerabilities</h3>
        <FindingsTable vulnerabilities={state.vulnerabilities} onSelect={setSelectedId} />
      </GlassCard>

      <GlassCard className="p-6">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" /> Rejected Candidates
        </h3>
        <RejectedCandidatesSection candidates={state.rejectedCandidates} />
      </GlassCard>
    </div>
  );
}