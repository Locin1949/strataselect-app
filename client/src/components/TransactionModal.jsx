import React, { useState } from 'react';

// FIXED IMPORTS — removed alias paths
import { runAutomation } from '../automation/orchestrator';
import { learnFromUserCorrection } from '../utils/automationEngine';
import { loadAutomationSettings } from '../utils/automationSettingsStore';
import { learnSplitRule } from '../utils/splitEngine';
import AutomationLogPanel from './AutomationLogPanel';
import CategorySuggest from './CategorySuggest';
import SplitReview from './SplitReview';

export default function TransactionModal({ editItem, onClose, onSave, categoryList }) {
  const settings = loadAutomationSettings();

  const [form, setForm] = useState(
    editItem || {
      date: '',
      category: '',
      fund: 'Admin',
      amount: '',
      description: '',
      vendor: '',
      receipt: null
    }
  );

  const [pendingSplit, setPendingSplit] = useState(null);

  // NEW — log viewer state
  const [automationLogs, setAutomationLogs] = useState(null);
  const [showLogs, setShowLogs] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit() {
    if (!form.date || !form.amount) return;

    const result = runAutomation(
      {
        description: form.description,
        amount: form.amount,
        vendor: form.vendor,
        date: form.date,
        fund: form.fund
      },
      settings
    );

    // Save logs for viewing
    setAutomationLogs(result.logs);

    // SPLIT DETECTED
    if (result.split && result.split.length > 0) {
      const prepared = result.split.map(s => ({
        ...s,
        amount: Number(s.amount).toFixed(2)
      }));
      setPendingSplit(prepared);
      return;
    }

    // AUTO-ASSIGN CATEGORY
    if (result.category && result.autoAssigned) {
      form.category = result.category;
    }

    // LEARNING HOOK
    if (editItem && editItem.category !== form.category) {
      learnFromUserCorrection(editItem, form.category);
    }

    onSave(form);
  }

  function handleSaveSplit() {
    const total = pendingSplit.reduce((acc, s) => acc + Number(s.amount || 0), 0);

    if (Math.abs(total - Number(form.amount)) > 0.01) {
      alert('Split amounts must total the original amount.');
      return;
    }

    learnSplitRule(form.vendor || form.description, pendingSplit);

    onSave({
      split: pendingSplit.map(s => ({
        ...s,
        date: form.date,
        fund: form.fund,
        vendor: form.vendor,
        receipt: form.receipt
      }))
    });
  }

  function handleCancelSplit() {
    setPendingSplit(null);
  }

  return (
    <div style={modalOverlay}>
      <div style={modalBox}>
        <h2 style={{ marginBottom: '10px' }}>
          {editItem ? 'Edit Transaction' : 'Add Transaction'}
        </h2>

        {/* SPLIT REVIEW MODE */}
        {pendingSplit ? (
          <>
            <SplitReview
              splits={pendingSplit}
              onChange={setPendingSplit}
              categoryList={categoryList}
              totalAmount={form.amount}
            />

            <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
              <button onClick={handleSaveSplit} style={btnPrimary}>
                Save Split
              </button>
              <button onClick={handleCancelSplit} style={btnSecondary}>
                Cancel Split
              </button>
            </div>
          </>
        ) : (
          <>
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              style={input}
            />

            <input
              name="vendor"
              placeholder="Vendor"
              value={form.vendor}
              onChange={handleChange}
              style={input}
            />

            <CategorySuggest
              value={form.category}
              onChange={v => setForm({ ...form, category: v })}
              suggestions={categoryList}
              fund={form.fund}
              description={form.description}
              amount={form.amount}
              automationMode={settings.automationMode}
            />

            <select name="fund" value={form.fund} onChange={handleChange} style={input}>
              <option>Admin</option>
              <option>Sinking</option>
            </select>

            <input
              name="amount"
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={handleChange}
              style={input}
            />

            <input
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              style={input}
            />

            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={e => setForm({ ...form, receipt: e.target.files[0] })}
              style={input}
            />

            {form.receipt && (
              <div style={{ marginTop: '10px', fontSize: '14px' }}>
                Attached: {form.receipt.name}
              </div>
            )}

            <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
              <button onClick={handleSubmit} style={btnPrimary}>
                Save
              </button>

              <button onClick={onClose} style={btnSecondary}>
                Cancel
              </button>

              {/* NEW — View Logs */}
              {automationLogs && (
                <button onClick={() => setShowLogs(true)} style={btnSecondary}>
                  View Logs
                </button>
              )}
            </div>
          </>
        )}

        {/* LOG PANEL */}
        {showLogs && automationLogs && (
          <AutomationLogPanel logs={automationLogs} onClose={() => setShowLogs(false)} />
        )}
      </div>
    </div>
  );
}

/* STYLES */
const modalOverlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0,0,0,0.4)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999
};

const modalBox = {
  background: 'white',
  padding: '20px',
  borderRadius: '8px',
  width: '380px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
};

const input = {
  width: '100%',
  padding: '8px',
  marginTop: '10px',
  border: '1px solid #ccc',
  borderRadius: '4px'
};

const btnPrimary = {
  padding: '8px 14px',
  background: '#1e3a8a',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

const btnSecondary = {
  padding: '8px 14px',
  background: '#6b7280',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};
