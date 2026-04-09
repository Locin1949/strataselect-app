import React from "react";
import { useTheme } from "../theme/ThemeContext";

export default function Header({ user, scheme }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "60px",
        background: theme.surface,
        color: theme.text,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        borderBottom: `1px solid ${theme.border}`,
        boxShadow: theme.shadow,
        zIndex: 20
      }}
    >
      {/* LEFT — Scheme Name */}
      <div>
        <h2 style={{ margin: 0, fontSize: "20px", color: theme.primary }}>
          {scheme?.name || "StrataSelect Dashboard"}
        </h2>
        <span style={{ fontSize: "13px", color: theme.textMuted }}>
          {scheme?.address}
        </span>
      </div>

      {/* RIGHT — Theme Toggle + User + Logout */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button
          onClick={toggleTheme}
          style={{
            background: "transparent",
            border: `1px solid ${theme.border}`,
            color: theme.text,
            padding: "6px 10px",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 13
          }}
        >
          {theme.name === "light" ? "Dark mode" : "Light mode"}
        </button>

        <span style={{ color: theme.textMuted, fontSize: "14px" }}>
          Logged in as: <strong>{user?.id}</strong>
        </span>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          style={{
            background: theme.primary,
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            transition: "0.2s background"
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = theme.primaryHover)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = theme.primary)
          }
        >
          Logout
        </button>
      </div>
    </header>
  );
}
