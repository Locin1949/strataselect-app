import React from "react";
import { useTheme } from "../../theme/ThemeContext";

export default function Textarea({ label, error, ...props }) {
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

      <textarea
        {...props}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: 6,
          border: `1px solid ${theme.border}`,
          background: theme.surface,
          color: theme.text,
          fontSize: 14,
          minHeight: 80
        }}
      />

      {error && (
        <div style={{ marginTop: 4, color: theme.danger, fontSize: 12 }}>
          {error}
        </div>
      )}
    </div>
  );
}
