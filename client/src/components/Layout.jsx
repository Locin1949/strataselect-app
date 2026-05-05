import React, { useState } from 'react';

import Header from './Header';
import NotificationCenter from './NotificationCenter';
// FIXED IMPORTS — removed @ aliases
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      {/* MOBILE BACKDROP */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40 w-64 transform bg-slate-900 text-white
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:inset-0
        `}
      >
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      {/* MAIN AREA */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          onNotificationsClick={() => setNotifOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* NOTIFICATION CENTER */}
      <NotificationCenter
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        notifications={[
          {
            id: 1,
            title: 'Import Completed',
            message: 'Your financial import finished successfully.',
            time: '2 minutes ago'
          },
          {
            id: 2,
            title: 'New Maintenance Request',
            message: 'Unit 12 submitted a new maintenance ticket.',
            time: '1 hour ago'
          }
        ]}
      />
    </div>
  );
}
