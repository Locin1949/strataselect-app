import React from "react";
import { useTheme } from "../../theme/ThemeContext";

export default function Select({ label, error, children, ...props }) {
  const { theme } = useTheme();

  return (
    <div style={{ marginBottom: 14 }}>
      {label && (
        <label
          style={{
            display: "block",
            marginBottom: 6,
            fontSize: 14,
            color: theme.text
          }}
        >
          {label}
        </label>
      )}

      <select
        {...props}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: 6,
          border: `1px solid ${theme.border}`,
          background: theme.surface,
          color: theme.text,
          fontSize: 14
        }}
      >
        {children}
      </select>

      {error && (
        <div style={{ marginTop: 4, color: theme.danger, fontSize: 12 }}>
          {error}
        </div>
      )}
    </div>
  );
}
