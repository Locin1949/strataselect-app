import React from 'react';
import { FiBell,FiX } from 'react-icons/fi';

export default function NotificationCenter({ open, onClose, notifications = [] }) {
  return (
    <>
      {/* BACKDROP */}
      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />
      )}

      {/* PANEL */}
      <div
        className={`
          fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50
          transform transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <FiBell className="text-slate-700" size={18} />
            <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
          </div>

          <button onClick={onClose} className="p-2 rounded-md hover:bg-slate-100 transition">
            <FiX size={18} className="text-slate-600" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-4 overflow-y-auto h-[calc(100%-64px)] space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center text-slate-500 text-sm mt-10">No notifications yet.</div>
          ) : (
            notifications.map(n => <NotificationItem key={n.id} notification={n} />)
          )}
        </div>
      </div>
    </>
  );
}

function NotificationItem({ notification }) {
  return (
    <div className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
      <div className="font-medium text-slate-900">{notification.title}</div>
      <div className="text-sm text-slate-600 mt-1">{notification.message}</div>
      <div className="text-xs text-slate-400 mt-2">{notification.time}</div>
    </div>
  );
}
