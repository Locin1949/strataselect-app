import React, { useEffect,useState } from 'react';

import AutomationSettingsPanel from '@/components/AutomationSettingsPanel';
import { loadAutomationSettings, saveAutomationSettings } from '@/utils/automationSettingsStore';

export default function SettingsPage() {
  const [settings, setSettings] = useState(loadAutomationSettings());

  useEffect(() => {
    saveAutomationSettings(settings);
  }, [settings]);

  return (
    <div style={page}>
      <h1 style={title}>Automation Settings</h1>

      <AutomationSettingsPanel settings={settings} onChange={setSettings} />
    </div>
  );
}

const page = {
  padding: '20px'
};

const title = {
  fontSize: '24px',
  fontWeight: 700,
  marginBottom: '20px'
};
