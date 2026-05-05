import React from 'react';
import { FiBell, FiSearch, FiSun, FiUser } from 'react-icons/fi';
import { HiMenuAlt2 } from 'react-icons/hi';

export default function Header({ onMenuClick, onNotificationsClick }) {
  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-20">
      {/* LEFT SIDE — MOBILE MENU BUTTON + BRAND */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md hover:bg-slate-100 transition"
        >
          <HiMenuAlt2 size={22} className="text-slate-700" />
        </button>

        <div className="text-lg font-bold tracking-wide text-slate-800">STRATASELECT</div>
      </div>

      {/* CENTER — SEARCH BAR */}
      <div className="hidden md:flex items-center bg-slate-100 px-3 py-1.5 rounded-md w-80">
        <FiSearch className="text-slate-500 mr-2" size={16} />
        <input
          type="text"
          placeholder="Search…"
          className="bg-transparent outline-none text-sm text-slate-700 w-full"
        />
      </div>

      {/* RIGHT SIDE — ACTIONS */}
      <div className="flex items-center gap-4">
        {/* THEME TOGGLE (placeholder) */}
        <button className="p-2 rounded-md hover:bg-slate-100 transition">
          <FiSun size={18} className="text-slate-600" />
        </button>

        {/* NOTIFICATIONS */}
        <button
          className="relative p-2 rounded-md hover:bg-slate-100 transition"
          onClick={onNotificationsClick}
        >
          <FiBell size={18} className="text-slate-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* USER MENU */}
        <button className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-100 transition">
          <FiUser size={18} className="text-slate-600" />
          <span className="hidden md:inline text-sm text-slate-700 font-medium">Admin</span>
        </button>
      </div>
    </header>
  );
}
