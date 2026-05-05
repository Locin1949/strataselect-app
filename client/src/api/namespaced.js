import http from './http';

const api = {
  // =========================
  // RAW HTTP (for useApiMutation)
  // =========================
  raw: {
    get: url => http.get(url),
    post: (url, data) => http.post(url, data),
    put: (url, data) => http.put(url, data),
    delete: (url, data) => http.delete(url, data)
  },

  // =========================
  // AUTH
  // =========================
  auth: {
    login: (committee_id, password) => http.post('/api/login', { committee_id, password }),

    me: () => http.get('/api/auth/me')
  },

  // =========================
  // DASHBOARD
  // =========================
  dashboard: {
    getHealth: () => http.get('/health'),
    getCommitteeDashboard: () => http.get('/api/committee/dashboard'),
    getRfpResponsesSummary: () => http.get('/api/rfp/responses/summary')
  },

  // =========================
  // FINANCIALS
  // =========================
  financials: {
    getAccounts: () => http.get('/api/financials/accounts'),
    getTransactions: () => http.get('/api/financials/transactions'),
    addTransaction: data => http.post('/api/financials/transactions', data),
    updateTransaction: (id, data) => http.put(`/api/financials/transactions/${id}`, data),
    deleteTransaction: id => http.delete(`/api/financials/transactions/${id}`),

    getMonthly: () => http.get('/api/financials/monthly'),

    // Added to match your hooks
    getCashbook: () => http.get('/api/financials/cashbook'),
    getImportHistory: () => http.get('/api/financials/import-history'),

    // Import Wizard
    importDetect: file => {
      const form = new FormData();
      form.append('file', file);
      return http.post('/api/import/detect', form);
    },

    importClassify: data => http.post('/api/import/classify', data),
    importCommit: data => http.post('/api/import/commit', data)
  },

  // =========================
  // SCHEMES
  // =========================
  scheme: {
    get: schemeId => http.get(`/api/schemes/${schemeId}`)
  },

  // =========================
  // COMMITTEE
  // =========================
  committee: {
    getMembers: () => http.get('/api/users'),
    getMembersByScheme: schemeId => http.get(`/api/committee/${schemeId}/members`)
  },

  // =========================
  // MEETINGS
  // =========================
  meetings: {
    getAll: () => http.get('/api/meetings'),
    create: data => http.post('/api/meetings', data),
    update: (id, data) => http.put(`/api/meetings/${id}`, data),
    remove: id => http.delete(`/api/meetings/${id}`)
  },

  // =========================
  // MAINTENANCE
  // =========================
  maintenance: {
    getAll: () => http.get('/api/maintenance'),
    create: data => http.post('/api/maintenance', data),
    update: (id, data) => http.put(`/api/maintenance/${id}`, data),
    remove: id => http.delete(`/api/maintenance/${id}`),

    getExtras: () => http.get('/api/maintenance/extras'),
    getFiles: () => http.get('/api/maintenance/files'),
    getAudit: id => http.get(`/api/maintenance/${id}/audit`),
    getRequests: () => http.get('/api/maintenance/requests'),

    uploadFile: (id, file) => {
      const form = new FormData();
      form.append('file', file);
      return http.post(`/api/maintenance/${id}/files`, form);
    }
  },

  // =========================
  // RFPs
  // =========================
  rfps: {
    getAll: () => http.get('/api/rfps'),
    create: data => http.post('/api/rfps', data),
    update: (id, data) => http.put(`/api/rfps/${id}`, data),
    remove: id => http.delete(`/api/rfps/${id}`)
  }
};

export default api;
