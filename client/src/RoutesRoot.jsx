import React from 'react';
import { BrowserRouter, Route,Routes } from 'react-router-dom';

import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import Committee from '@/pages/Committee';
import Dashboard from '@/pages/Dashboard';
import Financials from '@/pages/Financials';
import Login from '@/pages/Login';
import Maintenance from '@/pages/Maintenance';
import Meetings from '@/pages/Meetings';
import Rfps from '@/pages/Rfps';

export default function RoutesRoot() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />

        {/* PROTECTED */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="committee" element={<Committee />} />
          <Route path="financials" element={<Financials />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="meetings" element={<Meetings />} />
          <Route path="rfps" element={<Rfps />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
