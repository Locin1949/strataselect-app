import React, { useState } from 'react';
import { BrowserRouter as Router, Navigate,Route, Routes } from 'react-router-dom';

// Layout wrapper
import Layout from './components/Layout';
import CommitteeDashboard from './pages/CommitteeDashboard';
import CommitteeMembers from './pages/CommitteeMembers';
import Financials from './pages/Financials';
import ImportHistory from './pages/ImportWizard/ImportHistory';
// Import Wizard
import ImportWizard from './pages/ImportWizard/ImportWizard';
import Login from './pages/Login';

export default function App() {
  const [user, setUser] = useState(null);
  const [scheme, setScheme] = useState(null);

  const ProtectedRoute = ({ children }) => {
    if (!user) return <Navigate to="/login" replace />;
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* LOGIN */}
        <Route path="/login" element={<Login setUser={setUser} setScheme={setScheme} />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout user={user} scheme={scheme} />
            </ProtectedRoute>
          }
        >
          <Route index element={<CommitteeDashboard user={user} scheme={scheme} />} />
          <Route path="committee-members" element={<CommitteeMembers />} />
          <Route path="financials" element={<Financials />} />

          {/* IMPORT WIZARD */}
          <Route path="financials/import" element={<ImportWizard />} />

          {/* IMPORT HISTORY */}
          <Route path="financials/import-history" element={<ImportHistory />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
