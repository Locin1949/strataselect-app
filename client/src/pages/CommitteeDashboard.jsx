import React, { useEffect, useState } from "react";
import {
  getCommitteeDashboard,
  getScheme,
  getCommitteeMembers,
  getFinancialAccounts,
  getMeetings,
  getMaintenanceRequests,
  getRfpResponsesSummary
} from "../api";
import Card from "../components/Card";

export default function CommitteeDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [scheme, setScheme] = useState(null);
  const [committeeMembers, setCommitteeMembers] = useState([]);
  const [financialAccounts, setFinancialAccounts] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [rfpResponses, setRfpResponses] = useState([]);

  // NEW: Loading + Error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  async function loadAllData() {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

      const [
        dashboardRes,
        schemeRes,
        membersRes,
        financialsRes,
        meetingsRes,
        maintenanceRes,
        rfpRes
      ] = await Promise.all([
        getCommitteeDashboard(token),
        getScheme(token),
        getCommitteeMembers(token),
        getFinancialAccounts(token),
        getMeetings(token),
        getMaintenanceRequests(token),
        getRfpResponsesSummary(token)
      ]);

      setDashboardData(dashboardRes);
      setScheme(schemeRes);
      setCommitteeMembers(membersRes);
      setFinancialAccounts(financialsRes);
      setMeetings(meetingsRes);
      setMaintenanceRequests(maintenanceRes);
      setRfpResponses(rfpRes);

    } catch (err) {
      console.error("Dashboard load error:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  loadAllData();

}, []);   //

  // NEW: Loading state
  if (loading) {
    return (
      <div style={{ padding: "30px", fontSize: "18px" }}>
        Loading dashboard...
      </div>
    );
  }

  // NEW: Error state
  if (error) {
    return (
      <div style={{ padding: "30px", color: "red" }}>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "10px 16px",
            background: "#1e3a8a",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  // NORMAL RENDER
  return (
    <div style={{ display: "grid", gap: "20px" }}>
      
      {/* USER DETAILS */}
      <Card title="Your Details">
        <pre
          style={{
            background: "#eef7ff",
            padding: "10px",
            borderRadius: "5px",
            overflowX: "auto"
          }}
        >
          {JSON.stringify(dashboardData?.user, null, 2)}
        </pre>
      </Card>

      {/* SCHEME DETAILS */}
      <Card title="Scheme Details">
        {scheme ? (
          <>
            <p><strong>Name:</strong> {scheme.name}</p>
            <p><strong>CTS:</strong> {scheme.cts_number}</p>
            <p><strong>Address:</strong> {scheme.address}</p>
          </>
        ) : (
          <p>No scheme data available.</p>
        )}
      </Card>

      {/* COMMITTEE MEMBERS */}
      <Card title="Committee Members">
        {committeeMembers.length > 0 ? (
          <ul>
            {committeeMembers.map((m, i) => (
              <li key={i}>
                {m.name} — {m.role}
              </li>
            ))}
          </ul>
        ) : (
          <p>No committee members found.</p>
        )}
      </Card>

      {/* FINANCIAL ACCOUNTS */}
      <Card title="Financial Accounts">
        {financialAccounts.length > 0 ? (
          <ul>
            {financialAccounts.map((acc, i) => (
              <li key={i}>
                <strong>{acc.name}</strong>: ${acc.balance}  
                <br />
                <small>Updated: {acc.updated_at}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>No financial data available.</p>
        )}
      </Card>

      {/* MEETINGS */}
      <Card title="Meetings">
        {meetings.length > 0 ? (
          <ul>
            {meetings.map((m, i) => (
              <li key={i}>
                <strong>{m.type}</strong> — {m.date}
                <br />
                <small>{m.summary}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>No meetings found.</p>
        )}
      </Card>

      {/* MAINTENANCE REQUESTS */}
      <Card title="Maintenance Requests">
        {maintenanceRequests.length > 0 ? (
          <ul>
            {maintenanceRequests.map((req, i) => (
              <li key={i}>
                <strong>{req.title}</strong> — {req.status}
                <br />
                <small>{req.date}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>No maintenance requests found.</p>
        )}
      </Card>

      {/* RFP RESPONSES */}
      <Card title="RFP Responses">
        {rfpResponses.length > 0 ? (
          <ul>
            {rfpResponses.map((r, i) => (
              <li key={i}>
                <strong>{r.rfp_title}</strong> — {r.response_count} responses
              </li>
            ))}
          </ul>
        ) : (
          <p>No RFP responses found.</p>
        )}
      </Card>

    </div>
  );
}