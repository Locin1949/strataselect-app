import React from 'react';
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';

import Layout from './components/Layout';
import ActivityLog from './pages/ActivityLog';
import Dashboard from './pages/Dashboard';
import Financials from './pages/Financials';
import ImportHistory from './pages/ImportHistory';
import Settings from './pages/Settings';
import VendorIntelligence from './pages/VendorIntelligence';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/financials" element={<Financials />} />
          <Route path="/import-history" element={<ImportHistory />} />
          <Route path="/vendor-intelligence" element={<VendorIntelligence />} />
          <Route path="/settings" element={<Settings />} />

          {/* ⭐ NEW ROUTE */}
          <Route path="/activity-log" element={<ActivityLog />} />

          {/* DEFAULT REDIRECT */}
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}
