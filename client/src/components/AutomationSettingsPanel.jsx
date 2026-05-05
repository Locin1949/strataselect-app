import React from 'react';

export default function AutomationSettingsPanel({ settings, onChange }) {
  const update = (field, value) => {
    onChange({ ...settings, [field]: value });
  };

  return (
    <div style={box}>
      <h3 style={title}>Automation Settings</h3>

      {/* MODE */}
      <div style={row}>
        <label style={label}>Automation Mode</label>
        <select
          value={settings.automationMode}
          onChange={e => update('automationMode', e.target.value)}
          style={select}
        >
          <option value="manual">Manual</option>
          <option value="assisted">Assisted</option>
          <option value="automatic">Automatic</option>
        </select>
      </div>

      {/* PREMIUM ENGINE */}
      <div style={row}>
        <label style={label}>Premium Engine</label>
        <input
          type="checkbox"
          checked={settings.premiumEnabled}
          onChange={e => update('premiumEnabled', e.target.checked)}
        />
      </div>

      {/* AUTO SPLIT */}
      <div style={row}>
        <label style={label}>Auto-Splitting</label>
        <input
          type="checkbox"
          checked={settings.autoSplitEnabled}
          onChange={e => update('autoSplitEnabled', e.target.checked)}
        />
      </div>

      {/* EXCEPTION THRESHOLD */}
      <div style={row}>
        <label style={label}>Exception Threshold</label>
        <input
          type="number"
          min={0}
          max={100}
          value={settings.exceptionThreshold}
          onChange={e => update('exceptionThreshold', Number(e.target.value))}
          style={input}
        />
      </div>
    </div>
  );
}

const box = {
  background: 'white',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '16px'
};

const title = { fontSize: '18px', fontWeight: 600, marginBottom: '12px' };

const row = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '12px'
};

const label = { fontSize: '14px', fontWeight: 500 };

const select = {
  padding: '6px 8px',
  borderRadius: '4px',
  border: '1px solid #ccc'
};

const input = {
  width: '80px',
  padding: '6px 8px',
  borderRadius: '4px',
  border: '1px solid #ccc'
};
