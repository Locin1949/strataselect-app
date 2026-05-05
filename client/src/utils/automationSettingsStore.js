// src/utils/automationSettingsStore.js

const STORAGE_KEY = 'automationSettings_v1';

/**
 * Default automation settings.
 * These values are used when no settings exist in storage.
 */
const DEFAULT_SETTINGS = {
  automationMode: 'off', // off | suggest | auto
  exceptionThreshold: 60, // confidence % below which items are flagged
  splitDetectionEnabled: true, // enable split detection
  learningEnabled: true // enable vendor/description/amount learning
};

/**
 * Load automation settings from localStorage.
 * Ensures all required fields exist.
 */
export function loadAutomationSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };

    const parsed = JSON.parse(raw);

    return {
      automationMode: parsed.automationMode ?? DEFAULT_SETTINGS.automationMode,
      exceptionThreshold: parsed.exceptionThreshold ?? DEFAULT_SETTINGS.exceptionThreshold,
      splitDetectionEnabled: parsed.splitDetectionEnabled ?? DEFAULT_SETTINGS.splitDetectionEnabled,
      learningEnabled: parsed.learningEnabled ?? DEFAULT_SETTINGS.learningEnabled
    };
  } catch (err) {
    console.error('Failed to load automation settings:', err);
    return { ...DEFAULT_SETTINGS };
  }
}

/**
 * Save automation settings to localStorage.
 */
export function saveAutomationSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save automation settings:', err);
  }
}
