import { useState } from 'react';
import { Sparkles, Send, ShieldAlert, Lightbulb, Wrench, CheckCircle2, MessageSquare } from 'lucide-react';
import PrincipleCallout from '../shared/PrincipleCallout';

export default function AIAssistantTab({ vuln }) {
  const ai = vuln.ai;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  function handleSend(e) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const exactMatch = ai.cannedReplies.find((c) => c.q.toLowerCase() === trimmed.toLowerCase());
    const userTurns = messages.filter((m) => m.role === 'user').length;
    const fallback = ai.cannedReplies[userTurns % ai.cannedReplies.length];
    const reply = exactMatch?.a ?? fallback.a;

    setMessages((prev) => [...prev, { role: 'user', text: trimmed }, { role: 'ai', text: reply }]);
    setInput('');
  }

  return (
    <div className="space-y-5">
      <PrincipleCallout tone="cyan" icon={Sparkles}>
        <span className="font-medium text-cyberCyan-200">AI is an explainer, not the source of truth.</span> Every
        statement below is generated strictly from the validated evidence in the Evidence tab.
      </PrincipleCallout>

      <Block icon={MessageSquare} title="Structured Explanation" text={ai.explanation} />
      <Block icon={ShieldAlert} title="Impact" text={ai.impact} tone="amber" />
      <Block icon={Wrench} title="Remediation Recommendation" text={ai.remediation} tone="emerald" />
      <Block icon={CheckCircle2} title="Verification Criteria" text={ai.verificationCriteria} tone="cyan" />
      <Block icon={Lightbulb} title="In Simple Terms" text={ai.simpleExplanation} tone="slate" />

      <div className="pt-3 border-t border-slate-800">
        <div className="text-xs font-semibold text-slate-400 mb-2.5 flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5" /> Ask CyberGuard AI about this finding
        </div>

        <div className="rounded-xl border border-slate-800 bg-navy-900/40 flex flex-col h-64">
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-600 text-xs gap-2 px-4">
                <Sparkles className="w-5 h-5" />
                Try a suggested question below.
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-cyberCyan-500/15 text-cyberCyan-100 border border-cyberCyan-500/20'
                      : 'bg-navy-800/80 text-slate-300 border border-slate-700'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSend} className="flex items-center gap-2 p-2.5 border-t border-slate-800">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about this finding..."
              className="flex-1 bg-navy-800/60 border border-slate-700 focus:border-cyberCyan-500 outline-none rounded-lg px-3 py-2 text-xs text-white"
            />
            <button type="submit" className="p-2 rounded-lg bg-cyberCyan-500 hover:bg-cyberCyan-400 text-navy-900 transition-colors">
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {ai.cannedReplies.map((c, i) => (
            <button
              key={i}
              onClick={() => setInput(c.q)}
              className="text-[11px] px-2.5 py-1 rounded-full border border-slate-700 text-slate-400 hover:text-cyberCyan-300 hover:border-cyberCyan-500/40 transition-colors"
            >
              {c.q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Block({ icon: Icon, title, text, tone = 'cyan' }) {
  const toneColor = {
    cyan: 'text-cyberCyan-400',
    amber: 'text-amber-400',
    emerald: 'text-cyberEmerald-400',
    slate: 'text-slate-400',
  }[tone];
  return (
    <div>
      <div className={`flex items-center gap-1.5 text-xs font-semibold mb-1.5 ${toneColor}`}>
        <Icon className="w-3.5 h-3.5" /> {title}
      </div>
      <p className="text-sm text-slate-300 leading-relaxed">{text}</p>
    </div>
  );
}