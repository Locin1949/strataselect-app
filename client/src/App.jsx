import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages that exist in your project
import Login from "./pages/Login";
import Dashboard from './pages/Dashboard.js';
import CommitteeDashboard from "./pages/CommitteeDashboard";
import CommitteeMembers from "./pages/CommitteeMembers";
import CashBook from "./pages/CashBook";
import CashBookReport from "./pages/CashBookReport";
import Financials from "./pages/Financials";
import FinancialsPrint from "./pages/FinancialsPrint";
import FinancialCharts from "./pages/FinancialCharts";
import FundSummaryReport from "./pages/FundSummaryReport";
import ImportWizard from "./pages/ImportWizard";
import ImportHistory from "./pages/ImportHistory";
import Maintenance from "./pages/Maintenance";
import Meetings from "./pages/Meetings";
import Rfps from "./pages/Rfps";
import RfpResponses from "./pages/RfpResponses";

export default function App() {
  return (
    <Router>
      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Dashboards */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/committee-dashboard" element={<CommitteeDashboard />} />

        {/* Committee */}
        <Route path="/committee-members" element={<CommitteeMembers />} />

        {/* Financials */}
        <Route path="/financials" element={<Financials />} />
        <Route path="/financials/print" element={<FinancialsPrint />} />
        <Route path="/financial-charts" element={<FinancialCharts />} />
        <Route path="/fund-summary" element={<FundSummaryReport />} />

        {/* Cash Book */}
        <Route path="/cashbook" element={<CashBook />} />
        <Route path="/cashbook-report" element={<CashBookReport />} />

        {/* Importing */}
        <Route path="/import-wizard" element={<ImportWizard />} />
        <Route path="/import-history" element={<ImportHistory />} />

        {/* Maintenance */}
        <Route path="/maintenance" element={<Maintenance />} />

        {/* Meetings */}
        <Route path="/meetings" element={<Meetings />} />

        {/* RFPs */}
        <Route path="/rfps" element={<Rfps />} />
        <Route path="/rfp-responses" element={<RfpResponses />} />

      </Routes>
    </Router>
  );
}
