import React, { useEffect, useState } from "react";
import { getRfpResponsesSummary } from "../api";
import Card from "../components/Card";

export default function Rfps() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResponses() {
      try {
        const token = localStorage.getItem("token");
        const data = await getRfpResponsesSummary(token);
        setResponses(data);
      } catch (err) {
        console.error("Error loading RFP responses:", err);
      } finally {
        setLoading(false);
      }
    }

    loadResponses();
  }, []);

  if (loading) {
    return <p>Loading RFP responses...</p>;
  }

  return (
    <div style={{ display: "grid", gap: "20px" }}>
      <Card title="RFP Responses">
        {responses.length === 0 ? (
          <p>No RFP responses found.</p>
        ) : (
          <ul style={{ paddingLeft: "18px", margin: 0 }}>
            {responses.map((r) => (
              <li key={r.id} style={{ marginBottom: "12px" }}>
                <strong>RFP #{r.rfp_id}</strong> — Manager #{r.manager_id}
                <br />
                <span style={{ fontSize: "13px", color: "#555" }}>
                  {r.preview}...
                </span>
                <br />
                <span style={{ fontSize: "12px", color: "#888" }}>
                  Submitted: {r.submitted_at}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}