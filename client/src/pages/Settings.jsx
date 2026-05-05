import React, { useState } from 'react';
import { FiChevronDown,FiChevronRight } from 'react-icons/fi';

export default function Settings() {
  const [openSection, setOpenSection] = useState('appearance');

  const toggle = section => setOpenSection(openSection === section ? null : section);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">
          Manage your preferences, automation, notifications, and system behavior.
        </p>
      </div>

      {/* SETTINGS SECTIONS */}
      <div className="space-y-4">
        <SettingsSection
          title="Appearance"
          open={openSection === 'appearance'}
          onToggle={() => toggle('appearance')}
        >
          <AppearanceSettings />
        </SettingsSection>

        <SettingsSection
          title="Automation"
          open={openSection === 'automation'}
          onToggle={() => toggle('automation')}
        >
          <AutomationSettings />
        </SettingsSection>

        <SettingsSection
          title="Notifications"
          open={openSection === 'notifications'}
          onToggle={() => toggle('notifications')}
        >
          <NotificationSettings />
        </SettingsSection>

        <SettingsSection
          title="Account"
          open={openSection === 'account'}
          onToggle={() => toggle('account')}
        >
          <AccountSettings />
        </SettingsSection>

        <SettingsSection
          title="System"
          open={openSection === 'system'}
          onToggle={() => toggle('system')}
        >
          <SystemSettings />
        </SettingsSection>
      </div>
    </div>
  );
}

/* ============================
   SECTION WRAPPER
============================ */
function SettingsSection({ title, open, onToggle, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition"
      >
        <span className="text-lg font-semibold text-slate-900">{title}</span>
        {open ? (
          <FiChevronDown size={20} className="text-slate-500" />
        ) : (
          <FiChevronRight size={20} className="text-slate-500" />
        )}
      </button>

      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
}

/* ============================
   APPEARANCE SETTINGS
============================ */
function AppearanceSettings() {
  return (
    <div className="space-y-4">
      <SettingItem label="Theme">
        <select className="border border-slate-300 rounded-md p-2 text-sm">
          <option>Light</option>
          <option>Dark</option>
          <option>System</option>
        </select>
      </SettingItem>

      <SettingItem label="Density">
        <select className="border border-slate-300 rounded-md p-2 text-sm">
          <option>Comfortable</option>
          <option>Compact</option>
        </select>
      </SettingItem>
    </div>
  );
}

/* ============================
   AUTOMATION SETTINGS
============================ */
function AutomationSettings() {
  return (
    <div className="space-y-4">
      <SettingItem label="Automation Mode">
        <select className="border border-slate-300 rounded-md p-2 text-sm">
          <option>Assisted</option>
          <option>Automatic</option>
          <option>Manual</option>
        </select>
      </SettingItem>

      <SettingItem label="Exception Threshold">
        <input
          type="number"
          className="border border-slate-300 rounded-md p-2 text-sm w-24"
          placeholder="5%"
        />
      </SettingItem>
    </div>
  );
}

/* ============================
   NOTIFICATION SETTINGS
============================ */
function NotificationSettings() {
  return (
    <div className="space-y-4">
      <SettingItem label="Email Alerts">
        <input type="checkbox" className="w-4 h-4" />
      </SettingItem>

      <SettingItem label="In‑App Notifications">
        <input type="checkbox" className="w-4 h-4" />
      </SettingItem>

      <SettingItem label="Weekly Summary">
        <input type="checkbox" className="w-4 h-4" />
      </SettingItem>
    </div>
  );
}

/* ============================
   ACCOUNT SETTINGS
============================ */
function AccountSettings() {
  return (
    <div className="space-y-4">
      <SettingItem label="Display Name">
        <input
          type="text"
          className="border border-slate-300 rounded-md p-2 text-sm"
          placeholder="Your name"
        />
      </SettingItem>

      <SettingItem label="Email Address">
        <input
          type="email"
          className="border border-slate-300 rounded-md p-2 text-sm"
          placeholder="you@example.com"
        />
      </SettingItem>

      <SettingItem label="Password">
        <button className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition">
          Change Password
        </button>
      </SettingItem>
    </div>
  );
}

/* ============================
   SYSTEM SETTINGS
============================ */
function SystemSettings() {
  return (
    <div className="space-y-4">
      <SettingItem label="Data Export">
        <button className="px-3 py-2 bg-slate-700 text-white rounded-md text-sm hover:bg-slate-800 transition">
          Export Data
        </button>
      </SettingItem>

      <SettingItem label="Reset System">
        <button className="px-3 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition">
          Reset All Settings
        </button>
      </SettingItem>
    </div>
  );
}

/* ============================
   GENERIC SETTING ITEM
============================ */
function SettingItem({ label, children }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="text-sm font-medium text-slate-700">{label}</div>
      <div>{children}</div>
    </div>
  );
}
