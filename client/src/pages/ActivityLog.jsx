import React, { useState } from 'react';
import { FiAlertTriangle, FiCheckCircle,FiClock, FiDatabase, FiFilter } from 'react-icons/fi';

export default function ActivityLog() {
  const [filter, setFilter] = useState('all');

  const events = [
    {
      id: 1,
      type: 'import',
      title: 'Financial Import Completed',
      message: 'Imported 124 transactions successfully.',
      time: '2 minutes ago'
    },
    {
      id: 2,
      type: 'maintenance',
      title: 'New Maintenance Request',
      message: 'Unit 12 submitted a new maintenance ticket.',
      time: '1 hour ago'
    },
    {
      id: 3,
      type: 'automation',
      title: 'Automation Rule Applied',
      message: 'Vendor classification applied to 8 transactions.',
      time: '3 hours ago'
    },
    {
      id: 4,
      type: 'rfp',
      title: 'New RFP Response',
      message: 'A vendor submitted a response to RFP #2026‑04.',
      time: 'Yesterday'
    }
  ];

  const filteredEvents = filter === 'all' ? events : events.filter(e => e.type === filter);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Activity Log</h1>
        <p className="text-slate-500 mt-1">
          A complete timeline of system activity, imports, automation, and maintenance events.
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="flex items-center gap-3">
        <FiFilter className="text-slate-500" size={18} />
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="border border-slate-300 rounded-md p-2 text-sm"
        >
          <option value="all">All Activity</option>
          <option value="import">Imports</option>
          <option value="automation">Automation</option>
          <option value="maintenance">Maintenance</option>
          <option value="rfp">RFPs</option>
        </select>
      </div>

      {/* TIMELINE */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="text-slate-500 text-sm mt-10">No activity found.</div>
        ) : (
          filteredEvents.map(event => <ActivityItem key={event.id} event={event} />)
        )}
      </div>
    </div>
  );
}

/* ============================
   ACTIVITY ITEM COMPONENT
============================ */
function ActivityItem({ event }) {
  const icon = {
    import: <FiDatabase size={20} className="text-blue-600" />,
    automation: <FiCheckCircle size={20} className="text-emerald-600" />,
    maintenance: <FiAlertTriangle size={20} className="text-amber-600" />,
    rfp: <FiClock size={20} className="text-purple-600" />
  }[event.type];

  return (
    <div className="flex items-start gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition">
      <div className="mt-1">{icon}</div>

      <div className="flex-1">
        <div className="font-semibold text-slate-900">{event.title}</div>
        <div className="text-sm text-slate-600 mt-1">{event.message}</div>
        <div className="text-xs text-slate-400 mt-2">{event.time}</div>
      </div>
    </div>
  );
}
