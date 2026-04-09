export default function SkeletonTable({ rows = 5 }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <tr key={i}>
            <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
              <div
                style={{
                  height: "14px",
                  width: "80%",
                  background: "#e5e7eb",
                  borderRadius: "4px",
                  animation: "pulse 1.4s infinite ease-in-out"
                }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
