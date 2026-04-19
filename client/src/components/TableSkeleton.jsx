import React from "react";

export default function TableSkeleton({ rows = 5, columns = 4 }) {
  const skeletonRow = (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td
          key={i}
          style={{
            padding: "12px",
            borderBottom: "1px solid #eee"
          }}
        >
          <div
            style={{
              height: "14px",
              width: "80%",
              background: "#e0e0e0",
              borderRadius: "4px",
              animation: "pulse 1.5s infinite ease-in-out"
            }}
          />
        </td>
      ))}
    </tr>
  );

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <React.Fragment key={i}>{skeletonRow}</React.Fragment>
        ))}
      </tbody>

      <style>
        {`
          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }
        `}
      </style>
    </table>
  );
}
