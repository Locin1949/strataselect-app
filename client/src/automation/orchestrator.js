import { runAutomation as runEngine } from '../utils/automationEngine';
import { loadAutomationSettings } from '../utils/automationSettingsStore';

/**
 * Orchestrator wrapper used by ImportWizard.
 * Normalizes inputs and delegates to automationEngine.
 */
export function runAutomation(transaction, settingsOverride = null) {
  const settings = settingsOverride || loadAutomationSettings();
  return runEngine(transaction, settings);
}
