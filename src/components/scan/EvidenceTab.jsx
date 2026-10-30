import { FileCode2, Terminal, ShieldCheck, AlertTriangle } from 'lucide-react';
import PrincipleCallout from '../shared/PrincipleCallout';
import { formatTimestamp } from '../../utils/time';
import { VULN_STATE } from '../../constants/status';

export default function EvidenceTab({ vuln }) {
  const e = vuln.evidence;
  const validatedEntry = vuln.stateHistory.find((h) => h.state === VULN_STATE.VALIDATED);

  return (
    <div className="space-y-5">
      <PrincipleCallout tone="cyan" icon={ShieldCheck}>
        <span className="font-medium text-cyberCyan-200">Evidence-based detection:</span> everything below was
        captured directly from a live request/response. AI never generates or alters this evidence — it only
        explains it.
      </PrincipleCallout>

      <div className="grid sm:grid-cols-2 gap-4">
        <InfoRow label="Target URL" value={e.targetUrl} mono />
        <InfoRow label="HTTP Method" value={e.method} />
        {e.parameter && <InfoRow label="Parameter" value={e.parameter} mono />}
        <InfoRow label="Detection Rule" value={e.detectionRule} mono />
        <InfoRow label="Source" value={`${e.sourceFile}:${e.sourceLine}`} mono />
        <InfoRow
          label="Captured At"
          value={validatedEntry ? formatTimestamp(validatedEntry.timestamp) : 'Pending pipeline run'}
        />
      </div>

      {e.testInput && (
        <div>
          <SectionLabel icon={Terminal}>Test Input (Controlled, Non-Destructive)</SectionLabel>
          <pre className="font-mono text-xs bg-navy-900/60 border border-slate-800 rounded-lg p-3 text-amber-300 overflow-x-auto">
            {e.testInput}
          </pre>
        </div>
      )}

      <div>
        <SectionLabel icon={Terminal}>Request</SectionLabel>
        <pre className="font-mono text-xs bg-navy-900/60 border border-slate-800 rounded-lg p-3 text-slate-300 overflow-x-auto whitespace-pre-wrap">
          {e.request}
        </pre>
      </div>

      <div>
        <SectionLabel icon={Terminal}>Response Excerpt</SectionLabel>
        <pre className="font-mono text-xs bg-navy-900/60 border border-slate-800 rounded-lg p-3 text-slate-300 overflow-x-auto whitespace-pre-wrap">
          {e.responseExcerpt}
        </pre>
      </div>

      <div>
        <SectionLabel icon={AlertTriangle} tone="rose">Offending Content (Highlighted)</SectionLabel>
        <pre className="font-mono text-xs bg-rose-500/10 border border-rose-500/30 rounded-lg p-3 text-rose-300 overflow-x-auto whitespace-pre-wrap">
          {e.offendingContent}
        </pre>
      </div>

      {e.observedHeaders && (
        <div>
          <SectionLabel icon={FileCode2}>Observed vs Expected Headers</SectionLabel>
          <div className="rounded-lg border border-slate-800 overflow-hidden">
            <table className="w-full text-xs font-mono">
              <thead className="bg-navy-900/60 text-slate-500">
                <tr>
                  <th className="text-left px-3 py-2 font-medium">Header</th>
                  <th className="text-left px-3 py-2 font-medium">Observed</th>
                  <th className="text-left px-3 py-2 font-medium">Expected</th>
                </tr>
              </thead>
              <tbody>
                {e.observedHeaders.map((h) => {
                  const expected = e.expectedHeaders.find((x) => x.name === h.name);
                  return (
                    <tr key={h.name} className="border-t border-slate-800">
                      <td className="px-3 py-2 text-slate-300">{h.name}</td>
                      <td className={`px-3 py-2 ${h.present ? 'text-cyberEmerald-400' : 'text-rose-400'}`}>
                        {h.present ? h.value : 'Missing'}
                      </td>
                      <td className="px-3 py-2 text-slate-500">{expected ? expected.value : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {e.observedSetCookie && (
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <SectionLabel icon={AlertTriangle} tone="rose">Observed Set-Cookie</SectionLabel>
            <pre className="font-mono text-xs bg-rose-500/10 border border-rose-500/30 rounded-lg p-3 text-rose-300 overflow-x-auto whitespace-pre-wrap">
              {e.observedSetCookie}
            </pre>
          </div>
          <div>
            <SectionLabel icon={ShieldCheck} tone="emerald">Expected Set-Cookie</SectionLabel>
            <pre className="font-mono text-xs bg-cyberEmerald-500/10 border border-cyberEmerald-500/30 rounded-lg p-3 text-cyberEmerald-300 overflow-x-auto whitespace-pre-wrap">
              {e.expectedSetCookie}
            </pre>
          </div>
        </div>
      )}

      {e.reflection && <InfoRow label="Reflection Analysis" value={e.reflection} />}

      <div className="pt-2 border-t border-slate-800">
        <SectionLabel icon={ShieldCheck} tone="emerald">Validation Status</SectionLabel>
        <p className="text-sm text-cyberEmerald-300 font-medium">{e.validationStatus}</p>
      </div>
    </div>
  );
}

function InfoRow({ label, value, mono }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-slate-500 mb-1">{label}</div>
      <div className={`text-sm text-slate-200 ${mono ? 'font-mono' : ''} break-all`}>{value}</div>
    </div>
  );
}

function SectionLabel({ icon: Icon, children, tone = 'cyan' }) {
  const toneColor = { cyan: 'text-cyberCyan-400', rose: 'text-rose-400', emerald: 'text-cyberEmerald-400' }[tone];
  return (
    <div className={`flex items-center gap-1.5 text-xs font-semibold mb-1.5 ${toneColor}`}>
      <Icon className="w-3.5 h-3.5" /> {children}
    </div>
  );
}