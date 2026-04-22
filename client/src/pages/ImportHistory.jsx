import React, { useEffect, useState } from "react";
import Card from "../components/Card";

const API = process.env.REACT_APP_API_URL;

export default function ImportHistory() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reversal modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedImport, setSelectedImport] = useState(null);
  const [reversalNote, setReversalNote] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

  fetch(`${API}/financials/import/history`, {
          headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load import history.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReverse() {
    try {
      const token = localStorage.getItem("token");

      await fetch(`${API}/financials/import/reverse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          importId: selectedImport.id,
          note: reversalNote
        })
      });

      setShowModal(false);
      setSelectedImport(null);
      setReversalNote("");

      await loadHistory();
    } catch (err) {
      console.error(err);
      alert("Failed to reverse import.");
    }
  }

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading import history…</div>;
  }

  if (error) {
    return (
      <div style={{ padding: "20px", color: "red" }}>
        <p>{error}</p>
        <button onClick={loadHistory}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: "20px" }}>
      <Card title="Import History">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#e5e7eb" }}>
              <th style={th}>ID</th>
              <th style={th}>File</th>
              <th style={th}>Imported By</th>
              <th style={th}>Month Range</th>
              <th style={th}>Transactions</th>
              <th style={th}>Imported At</th>
              <th style={th}>Status</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td style={td}>{log.id}</td>
                <td style={td}>{log.filename}</td>
                <td style={td}>{log.imported_by}</td>
                <td style={td}>
                  {log.month_start} → {log.month_end}
                </td>
                <td style={td}>{log.transaction_count}</td>
                <td style={td}>{log.imported_at}</td>
                <td style={td}>
                  {log.reversed ? (
                    <span style={{ color: "red", fontWeight: "bold" }}>Reversed</span>
                  ) : (
                    <span style={{ color: "green", fontWeight: "bold" }}>Active</span>
                  )}
                </td>
                <td style={td}>
                  {!log.reversed && (
                    <button
                      style={btnSmall}
                      onClick={() => {
                        setSelectedImport(log);
                        setShowModal(true);
                      }}
                    >
                      Reverse
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {showModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3>Reverse Import #{selectedImport.id}</h3>
            <p>This will remove all transactions created by this import.</p>

            <textarea
              placeholder="Reversal note (required)"
              value={reversalNote}
              onChange={(e) => setReversalNote(e.target.value)}
              style={textarea}
            />

            <div style={{ marginTop: "10px" }}>
              <button
                onClick={handleReverse}
                disabled={!reversalNote.trim()}
                style={{
                  ...btnSmall,
                  background: reversalNote.trim() ? "#dc2626" : "#9ca3af"
                }}
              >
                Confirm Reversal
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{ ...btnSmall, background: "#6b7280" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles
const th = {
  padding: "10px",
  textAlign: "left",
  borderBottom: "1px solid #ddd"
};

const td = {
  padding: "8px",
  borderBottom: "1px solid #eee"
};

const btnSmall = {
  padding: "6px 10px",
  background: "#1e3a8a",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer"
};

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const modalBox = {
  background: "white",
  padding: "20px",
  borderRadius: "8px",
  width: "400px"
};

const textarea = {
  width: "100%",
  height: "80px",
  marginTop: "10px",
  padding: "8px",
  border: "1px solid #ccc",
  borderRadius: "4px"
};