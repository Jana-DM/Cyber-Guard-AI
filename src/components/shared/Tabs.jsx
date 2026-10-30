import { useState } from 'react';

export default function Tabs({ tabs, defaultTab }) {
  const [active, setActive] = useState(defaultTab ?? tabs[0].id);
  const activeTab = tabs.find((t) => t.id === active);

  return (
    <div>
      <div className="flex items-center gap-1 border-b border-slate-800 mb-5 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
              ${active === tab.id ? 'border-cyberCyan-400 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            {tab.icon && <tab.icon className="w-4 h-4" />}
            {tab.label}
          </button>
        ))}
      </div>
      <div>{activeTab?.content}</div>
    </div>
  );
}