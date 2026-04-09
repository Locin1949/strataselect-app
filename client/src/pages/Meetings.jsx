import React, { useEffect, useState } from "react";
import { getMeetings } from "../api";
import Card from "../components/Card";

export default function Meetings() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMeetings() {
      try {
        const token = localStorage.getItem("token");
        const data = await getMeetings(token);
        setMeetings(data);
      } catch (err) {
        console.error("Error loading meetings:", err);
      } finally {
        setLoading(false);
      }
    }

    loadMeetings();
  }, []);

  if (loading) {
    return <p>Loading meetings...</p>;
  }

  return (
    <div style={{ display: "grid", gap: "20px" }}>
      <Card title="Meetings">
        {meetings.length === 0 ? (
          <p>No meetings found.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "15px" }}>
            <thead>
              <tr>
                <th style={thStyle}>Title</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Location</th>
              </tr>
            </thead>
            <tbody>
              {meetings.map((m) => (
                <tr key={m.id}>
                  <td style={tdStyle}>{m.title}</td>
                  <td style={tdStyle}>{m.type}</td>
                  <td style={tdStyle}>{m.date}</td>
                  <td style={tdStyle}>{m.status}</td>
                  <td style={tdStyle}>{m.location || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  borderBottom: "1px solid #ddd",
  padding: "8px 6px",
  background: "#f8fafc"
};

const tdStyle = {
  borderBottom: "1px solid #f0f0f0",
  padding: "8px 6px"
};