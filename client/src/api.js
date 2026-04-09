// ---------------------------------------------
// API Base URL
// ---------------------------------------------
const API_BASE = "http://localhost:5000";

// ---------------------------------------------
// Helper functions
// ---------------------------------------------
async function authGet(url, token) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`GET failed: ${res.status}`);
  return res.json();
}

async function authSend(url, method, data, token) {
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`${method} failed: ${res.status}`);
  return res.json();
}

// ---------------------------------------------
// Authentication
// ---------------------------------------------
export async function login(id, password) {
  console.log("API_BASE at runtime:", API_BASE);

  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, password }),
  });

  if (!res.ok) throw new Error(`Login failed: ${res.status}`);
  return res.json();
}

// ---------------------------------------------
// Committee Members
// ---------------------------------------------
export async function getCommitteeMembers(token) {
  return authGet(`${API_BASE}/committee-members`, token);
}

export async function addCommitteeMember(data, token) {
  return authSend(`${API_BASE}/committee-members`, "POST", data, token);
}

export async function updateCommitteeMember(id, data, token) {
  return authSend(`${API_BASE}/committee-members/${id}`, "PUT", data, token);
}

export async function deleteCommitteeMember(id, token) {
  return authSend(`${API_BASE}/committee-members/${id}`, "DELETE", {}, token);
}

// ---------------------------------------------
// Financial Transactions
// ---------------------------------------------

// GET all transactions
export async function getFinancialTransactions(token) {
  return authGet(`${API_BASE}/api/financials`, token);
}

// POST new transaction
export async function addFinancialTransaction(data, token) {
  return authSend(`${API_BASE}/api/financials`, "POST", data, token);
}

// PUT update transaction
export async function updateFinancialTransaction(id, data, token) {
  return authSend(`${API_BASE}/api/financials/${id}`, "PUT", data, token);
}

// DELETE transaction
export async function deleteFinancialTransaction(id, token) {
  return authSend(`${API_BASE}/api/financials/${id}`, "DELETE", {}, token);
}

// ---------------------------------------------
// Monthly Financials (client-side only)
// ---------------------------------------------
// Your backend does NOT provide monthly data.
// Your frontend must compute this from transactions.
export function getMonthlyFinancialsFromTransactions(transactions) {
  const map = {};

  transactions.forEach((t) => {
    const month = t.date.slice(0, 7); // "YYYY-MM"
    map[month] = (map[month] || 0) + Number(t.amount);
  });

  return Object.entries(map).map(([month, total]) => ({
    month,
    total,
  }));
}
