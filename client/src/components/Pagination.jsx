import React from "react";
import { useTheme } from "../theme/ThemeContext";

export default function Pagination({
  page,
  totalPages,
  onPageChange
}) {
  const { theme } = useTheme();

  const btn = (active) => ({
    padding: "6px 12px",
    borderRadius: 6,
    border: `1px solid ${theme.border}`,
    background: active ? theme.primary : theme.surface,
    color: active ? "white" : theme.text,
    cursor: "pointer",
    fontSize: 14
  });

  return (
    <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
      <button
        style={btn(false)}
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        Prev
      </button>

      {[...Array(totalPages)].map((_, i) => {
        const p = i + 1;
        return (
          <button
            key={p}
            style={btn(p === page)}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        );
      })}

      <button
        style={btn(false)}
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}
