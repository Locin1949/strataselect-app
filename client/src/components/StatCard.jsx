import React from "react";
import { useTheme } from "../theme/ThemeContext";

export default function StatCard({
  label,
  value,
  icon,
  color = "#1e3a8a",
  trend = null,
  trendType = "neutral" // "up", "down", "neutral"
}) {
  const { theme } = useTheme();

  const trendColor =
    trendType === "up"
      ? "#16a34a"
      : trendType === "down"
      ? "#dc2626"
      : theme.textMuted;

  return (
    <div
      style={{
        background: theme.surface,
        padding: "20px",
        borderRadius: "12px",
        boxShadow: theme.shadow,
        border: `1px solid ${theme.border}`,
        display: "flex",
        alignItems: "center",
        gap: "16px",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        cursor: "pointer"
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      {/* ICON */}
      <div
        style={{
          fontSize: "26px",
          padding: "12px",
          borderRadius: "10px",
          background: color + "22",
          color
        }}
      >
        {icon}
      </div>

      {/* TEXT */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "14px", color: theme.textMuted }}>{label}</div>

        <div
          style={{
            fontSize: "26px",
            fontWeight: 700,
            color: theme.text,
            marginTop: 2
          }}
        >
          {value}
        </div>

        {trend && (
          <div
            style={{
              marginTop: 4,
              fontSize: "13px",
              color: trendColor,
              fontWeight: 500
            }}
          >
            {trendType === "up" && "▲ "}
            {trendType === "down" && "▼ "}
            {trend}
          </div>
        )}
      </div>
    </div>
  );
}
