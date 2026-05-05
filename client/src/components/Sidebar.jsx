import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const baseLink = 'flex items-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition';
  const inactive = 'text-slate-200 hover:bg-slate-800 hover:text-white';
  const active = 'bg-slate-800 text-white';

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800">
      {/* BRAND */}
      <div className="px-4 py-4 border-b border-slate-800">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
          CommitteeOS
        </div>
        <div className="text-lg font-bold text-white mt-1">Control Center</div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `${baseLink} ${isActive ? active : inactive}`}
        >
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/financials"
          className={({ isActive }) => `${baseLink} ${isActive ? active : inactive}`}
        >
          <span>Financials</span>
        </NavLink>

        <NavLink
          to="/import-history"
          className={({ isActive }) => `${baseLink} ${isActive ? active : inactive}`}
        >
          <span>Import History</span>
        </NavLink>

        <NavLink
          to="/vendor-intelligence"
          className={({ isActive }) => `${baseLink} ${isActive ? active : inactive}`}
        >
          <span>Vendor Intelligence</span>
        </NavLink>

        {/* ⭐ NEW — ACTIVITY LOG */}
        <NavLink
          to="/activity-log"
          className={({ isActive }) => `${baseLink} ${isActive ? active : inactive}`}
        >
          <span>Activity Log</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) => `${baseLink} ${isActive ? active : inactive}`}
        >
          <span>Settings</span>
        </NavLink>
      </nav>

      {/* FOOTER */}
      <div className="px-4 py-3 border-t border-slate-800 text-xs text-slate-400">
        <div>Premium Edition</div>
        <div className="text-slate-500">Category Killer Suite</div>
      </div>
    </aside>
  );
}
