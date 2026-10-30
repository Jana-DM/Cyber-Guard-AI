import { ChevronRight } from 'lucide-react';
import SeverityBadge from '../shared/SeverityBadge';
import VulnStateBadge from '../shared/VulnStateBadge';

export default function FindingsTable({ vulnerabilities, onSelect }) {
  return (
    <div className="rounded-xl border border-slate-800 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-navy-900/60 text-slate-500 text-xs uppercase tracking-wide">
          <tr>
            <th className="text-left px-4 py-3 font-medium">Type</th>
            <th className="text-left px-4 py-3 font-medium">Severity</th>
            <th className="text-left px-4 py-3 font-medium">Location</th>
            <th className="text-left px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {vulnerabilities.map((v) => (
            <tr
              key={v.id}
              onClick={() => onSelect(v.id)}
              className="border-t border-slate-800 hover:bg-navy-800/40 cursor-pointer transition-colors group"
            >
              <td className="px-4 py-3.5 text-white font-medium">{v.type}</td>
              <td className="px-4 py-3.5"><SeverityBadge severity={v.severity} /></td>
              <td className="px-4 py-3.5 text-slate-400 font-mono text-xs">{v.location}</td>
              <td className="px-4 py-3.5"><VulnStateBadge state={v.status} /></td>
              <td className="px-4 py-3.5 text-right">
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyberCyan-400 transition-colors inline-block" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}