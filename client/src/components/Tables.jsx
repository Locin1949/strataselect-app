import React from "react";
import { useTheme } from "../theme/ThemeContext";

export default function Table({
  columns,
  data,
  emptyMessage = "No records found.",
  sortField = null,
  sortDir = "asc",
  onSort = null
}) {
  const { theme } = useTheme();

  const handleSort = (key) => {
    if (!onSort) return;
    if (sortField === key) {
      onSort(key, sortDir === "asc" ? "desc" : "asc");
    } else {
      onSort(key, "asc");
    }
  };

  const sortIcon = (key) => {
    if (sortField !== key) return "";
    return sortDir === "asc" ? " ▲" : " ▼";
  };

  return (
    <div
      style={{
        border: `1px solid ${theme.border}`,
        borderRadius: 10,
        overflow: "hidden",
        background: theme.surface,
        boxShadow: theme.shadow
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: theme.surface, borderBottom: `1px solid ${theme.border}` }}>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => col.sortable && handleSort(col.key)}
                style={{
                  textAlign: "left",
                  padding: "12px 16px",
                  fontSize: 14,
                  fontWeight: 600,
                  color: theme.text,
                  cursor: col.sortable ? "pointer" : "default",
                  userSelect: "none"
                }}
              >
                {col.label}
                {col.sortable && <span>{sortIcon(col.key)}</span>}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  padding: "20px",
                  textAlign: "center",
                  color: theme.textMuted,
                  fontSize: 14
                }}
              >
                {emptyMessage}
              </td>
            </tr>
          )}

          {data.map((row, i) => (
            <tr
              key={row.id || i}
              style={{
                background: i % 2 === 0 ? theme.surface : theme.bg,
                transition: "0.15s background"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = theme.primary + "15")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = i % 2 === 0 ? theme.surface : theme.bg)
              }
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  style={{
                    padding: "12px 16px",
                    fontSize: 14,
                    color: theme.text,
                    borderBottom: `1px solid ${theme.border}`
                  }}
                >
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
