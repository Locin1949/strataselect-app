import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CommitteeMembers from "./pages/CommitteeMembers";
import Financials from "./pages/Financials";
import Meetings from "./pages/Meetings";
import Maintenance from "./pages/Maintenance";
import Contractors from "./pages/Contractors";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="committee-members" element={<CommitteeMembers />} />
        <Route path="financials" element={<Financials />} />
        <Route path="meetings" element={<Meetings />} />
        <Route path="maintenance" element={<Maintenance />} />
        <Route path="contractors" element={<Contractors />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
