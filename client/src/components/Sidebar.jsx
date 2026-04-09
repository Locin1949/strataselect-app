import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HiHome,
  HiUserGroup,
  HiCreditCard,
  HiClipboardDocumentList,
  HiDocumentText,
  HiArrowRightOnRectangle,
  HiWrenchScrewdriver,
  HiBriefcase
} from "react-icons/hi2";

export default function Sidebar({ onLogout }) {
  const location = useLocation();

  const navLink = (active) => ({
    display: "block",
    padding: "12px 16px",
    background: active ? "#1e3a8a" : "transparent",
    color: active ? "white" : "#1e293b",
    textDecoration: "none",
    borderRadius: "6px",
    marginBottom: "6px",
    fontWeight: active ? 600 : 500,
    transition: "0.15s background"
  });

  const linkRow = {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  };

  return (
    <div
      style={{
        width: "240px",
        background: "#f8fafc",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100vh",
        borderRight: "1px solid #e2e8f0",
        position: "fixed",
        left: 0,
        top: 0
      }}
    >
      {/* TOP SECTION */}
      <div>
        <h2
          style={{
            marginBottom: "30px",
            fontSize: "22px",
            fontWeight: 700,
            color: "#1e3a8a"
          }}
        >
          StrataSelect
        </h2>

        {/* MAIN NAV */}
        <nav>
          <Link
            to="/dashboard"
            style={navLink(location.pathname === "/dashboard")}
          >
            <div style={linkRow}>
              <HiHome size={20} />
              <span>Dashboard</span>
            </div>
          </Link>

          <Link
            to="/committee-members"
            style={navLink(location.pathname === "/committee-members")}
          >
            <div style={linkRow}>
              <HiUserGroup size={20} />
              <span>Committee Members</span>
            </div>
          </Link>

          <Link
            to="/financials"
            style={navLink(location.pathname === "/financials")}
          >
            <div style={linkRow}>
              <HiCreditCard size={20} />
              <span>Financials</span>
            </div>
          </Link>

          <Link
            to="/meetings"
            style={navLink(location.pathname === "/meetings")}
          >
            <div style={linkRow}>
              <HiClipboardDocumentList size={20} />
              <span>Meetings</span>
            </div>
          </Link>

          <Link
            to="/maintenance"
            style={navLink(location.pathname === "/maintenance")}
          >
            <div style={linkRow}>
              <HiWrenchScrewdriver size={20} />
              <span>Maintenance</span>
            </div>
          </Link>

          <Link
            to="/contractors"
            style={navLink(location.pathname === "/contractors")}
          >
            <div style={linkRow}>
              <HiBriefcase size={20} />
              <span>Contractors</span>
            </div>
          </Link>

          {/* REPORTS SECTION LABEL */}
          <div
            style={{
              marginTop: "20px",
              marginBottom: "8px",
              fontSize: "12px",
              fontWeight: 600,
              opacity: 0.6,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              paddingLeft: "4px"
            }}
          >
            Reports
          </div>

          <Link
            to="/reports/cashbook"
            style={navLink(location.pathname === "/reports/cashbook")}
          >
            <div style={linkRow}>
              <HiDocumentText size={20} />
              <span>Cash Book Report (PDF)</span>
            </div>
          </Link>

          <Link
            to="/reports/fund-summary"
            style={navLink(location.pathname === "/reports/fund-summary")}
          >
            <div style={linkRow}>
              <HiDocumentText size={20} />
              <span>Fund Summary Report</span>
            </div>
          </Link>

          <Link
            to="/rfps"
            style={navLink(location.pathname === "/rfps")}
          >
            <div style={linkRow}>
              <HiDocumentText size={20} />
              <span>RFP Responses</span>
            </div>
          </Link>
        </nav>
      </div>

      {/* LOGOUT BUTTON */}
      <button
        onClick={onLogout}
        style={{
          padding: "12px",
          background: "#dc2626",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontSize: "16px"
        }}
      >
        <HiArrowRightOnRectangle size={20} />
        Logout
      </button>
    </div>
  );
}
