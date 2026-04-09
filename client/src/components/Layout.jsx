import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useTheme } from "../theme/ThemeContext";

export default function Layout({ user, scheme }) {
  const { theme } = useTheme();

  // Sidebar open/closed state
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: theme.bg,
        color: theme.text,
        fontFamily: "Arial, sans-serif",
        overflow: "hidden"
      }}
    >
      {/* SIDEBAR */}
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onLogout={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
      />

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, marginLeft: sidebarOpen ? 240 : 0, transition: "0.25s" }}>
        {/* HEADER */}
        <Header
          user={user}
          scheme={scheme}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* PAGE CONTENT */}
        <div
          style={{
            padding: "30px",
            marginTop: "60px",
            minHeight: "calc(100vh - 60px)",
            background: theme.bg,
            color: theme.text,
            transition: "0.25s"
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
