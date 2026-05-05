import React from 'react';

export default function AutomationSettings({ mode, onChange, lockedModes = [] }) {
  const modes = [
    {
      id: 'manual',
      label: 'Manual',
      description: 'You choose every category yourself.',
      premium: false
    },
    {
      id: 'assisted',
      label: 'Assisted',
      description: 'Smart suggestions appear with confidence badges.',
      premium: false
    },
    {
      id: 'automatic',
      label: 'Automatic',
      description: 'Transactions are auto‑classified. You review exceptions.',
      premium: true
    }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 space-y-4">
      <h2 className="text-xl font-semibold text-slate-900">Automation Settings</h2>
      <p className="text-slate-600 text-sm">
        Choose how involved you want to be in categorising transactions.
      </p>

      <div className="space-y-3">
        {modes.map(m => {
          const locked = lockedModes.includes(m.id);

          return (
            <label
              key={m.id}
              className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition
                ${mode === m.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}
                ${locked ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <input
                type="radio"
                name="automationMode"
                value={m.id}
                checked={mode === m.id}
                disabled={locked}
                onChange={() => onChange(m.id)}
                className="mt-1"
              />

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-900">{m.label}</span>
                  {m.premium && (
                    <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded">
                      Premium
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-600 mt-1">{m.description}</p>

                {locked && (
                  <p className="text-xs text-red-600 mt-1">
                    Upgrade your plan to enable this mode.
                  </p>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
