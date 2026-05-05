// =========================
// API BASE URL
// =========================
export const API_BASE = 'https://strataselect-app.onrender.com';

// =========================
// AUTH
// =========================
export async function login(committee_id, password) {
  const res = await fetch(`${API_BASE}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ committee_id, password })
  });

  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export async function getProfile(token) {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
}

// =========================
// FINANCIAL HELPERS
// =========================
export function getMonthlyFinancialsFromTransactions(transactions) {
  const map = {};
  transactions.forEach(t => {
    const month = t.date.slice(0, 7); // "YYYY-MM"
    map[month] = (map[month] || 0) + Number(t.amount);
  });
  return Object.entries(map).map(([month, total]) => ({ month, total }));
}

// =========================
// FINANCIALS
// =========================
export async function getFinancialAccounts(token) {
  const res = await fetch(`${API_BASE}/api/financials`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) throw new Error('Failed to fetch financial accounts');
  return res.json();
}

export async function getFinancialTransactions(token) {
  const res = await fetch(`${API_BASE}/api/financials`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) throw new Error('Failed to fetch financial transactions');
  return res.json();
}

export async function addFinancialTransaction(token, data) {
  const res = await fetch(`${API_BASE}/api/financials`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error('Failed to add financial transaction');
  return res.json();
}

export async function updateFinancialTransaction(token, id, data) {
  const res = await fetch(`${API_BASE}/api/financials/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error('Failed to update financial transaction');
  return res.json();
}

export async function deleteFinancialTransaction(token, id) {
  const res = await fetch(`${API_BASE}/api/financials/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) throw new Error('Failed to delete financial transaction');
  return res.json();
}

export async function getMonthlyFinancials(token) {
  const res = await fetch(`${API_BASE}/api/financials/monthly`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error('Failed to fetch monthly financials');
  }

  return res.json();
}

// =========================
// COMMITTEE DASHBOARD
// =========================
export async function getCommitteeDashboard(token) {
  const res = await fetch(`${API_BASE}/api/committee/dashboard`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) throw new Error('Failed to fetch committee dashboard');
  return res.json();
}

export async function getRfpResponsesSummary(token) {
  const res = await fetch(`${API_BASE}/api/rfp/responses/summary`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error('Failed to fetch RFP responses summary');
  }

  return res.json();
}

// =========================
// SCHEME
// =========================
export async function getScheme(token, schemeId) {
  const res = await fetch(`${API_BASE}/api/schemes/${schemeId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) throw new Error('Failed to fetch scheme');
  return res.json();
}

// =========================
// COMMITTEE MEMBERS
// =========================
export async function getCommitteeMembers(token, schemeId) {
  const res = await fetch(`${API_BASE}/api/committee/${schemeId}/members`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) throw new Error('Failed to fetch committee members');
  return res.json();
}

// =========================
// MEETINGS
// =========================
export async function getMeetings(token) {
  const res = await fetch(`${API_BASE}/api/meetings`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) throw new Error('Failed to fetch meetings');
  return res.json();
}

// =========================
// MAINTENANCE
// =========================
export async function getMaintenance(token) {
  const res = await fetch(`${API_BASE}/api/maintenance`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) throw new Error('Failed to fetch maintenance list');
  return res.json();
}

export async function createMaintenance(token, data) {
  const res = await fetch(`${API_BASE}/api/maintenance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error('Failed to create maintenance request');
  return res.json();
}

export async function updateMaintenance(token, id, data) {
  const res = await fetch(`${API_BASE}/api/maintenance/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error('Failed to update maintenance request');
  return res.json();
}

export async function uploadMaintenanceFile(token, id, file) {
  const form = new FormData();
  form.append('file', file);

  const res = await fetch(`${API_BASE}/api/maintenance/${id}/files`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form
  });

  if (!res.ok) throw new Error('Failed to upload maintenance file');
  return res.json();
}

export async function getMaintenanceAudit(token, id) {
  const res = await fetch(`${API_BASE}/api/maintenance/${id}/audit`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) throw new Error('Failed to fetch maintenance audit');
  return res.json();
}

export async function getMaintenanceRequests(token) {
  const res = await fetch(`${API_BASE}/api/maintenance/requests`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error('Failed to fetch maintenance requests');
  }

  return res.json();
}

// =========================
// IMPORT WIZARD
// =========================
export async function importDetect(token, file) {
  const form = new FormData();
  form.append('file', file);

  const res = await fetch(`${API_BASE}/api/import/detect`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form
  });

  if (!res.ok) throw new Error('Import detect failed');
  return res.json();
}

export async function importClassify(token, data) {
  const res = await fetch(`${API_BASE}/api/import/classify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error('Import classify failed');
  return res.json();
}

export async function importCommit(token, data) {
  const res = await fetch(`${API_BASE}/api/import/commit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error('Import commit failed');
  return res.json();
}

// =========================
// GENERIC FETCH WRAPPER
// =========================
export async function apiGet(token, path) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) throw new Error(`GET ${path} failed`);
  return res.json();
}
