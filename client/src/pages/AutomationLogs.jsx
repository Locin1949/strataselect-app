import React from 'react';

import AutomationLogPanel from '@/components/AutomationLogPanel';

export default function AutomationLogs({ logs }) {
  return (
    <div style={{ padding: '20px' }}>
      <h1 className="text-2xl font-bold mb-4">Automation Log Viewer</h1>
      <AutomationLogPanel logs={logs} onClose={() => null} />
    </div>
  );
}
