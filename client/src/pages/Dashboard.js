import React from 'react';

// FIXED IMPORT — removed @ alias
import { useCommitteeMembers, useDashboard, useMaintenance, useRfps } from '../hooks';

export default function Dashboard() {
  const dashboard = useDashboard();
  const committee = useCommitteeMembers();
  const rfps = useRfps();
  const maintenance = useMaintenance();

  const isLoading =
    dashboard.isLoading || committee.isLoading || rfps.isLoading || maintenance.isLoading;

  const isError = dashboard.isError || committee.isError || rfps.isError || maintenance.isError;

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
        <p className="text-slate-600">Loading dashboard data…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
        <p className="text-red-600">Unable to load dashboard data. Please try again shortly.</p>
      </div>
    );
  }

  const status = dashboard.data?.status || 'Unknown';
  const committeeCount = committee.data?.length || 0;
  const rfpsCount = rfps.data?.length || 0;
  const maintenanceCount = maintenance.data?.length || 0;

  return (
    <div className="p-6 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">
            High-level view of system health, committee activity, RFPs, and maintenance.
          </p>
        </div>
      </div>

      {/* TOP SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DashboardCard
          title="System Health"
          value={status}
          tone={status === 'OK' ? 'success' : 'warning'}
        />
        <DashboardCard title="Committee Members" value={committeeCount} />
        <DashboardCard title="Open RFPs" value={rfpsCount} />
        <DashboardCard title="Active Maintenance" value={maintenanceCount} />
      </div>

      {/* GRID SECTIONS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* RECENT MAINTENANCE */}
        <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-slate-900">Recent Maintenance</h2>
            <span className="text-xs text-slate-500">{maintenance.data?.length || 0} total</span>
          </div>

          {maintenance.data?.length === 0 ? (
            <p className="text-slate-500 text-sm">No maintenance requests found.</p>
          ) : (
            <ul className="space-y-2">
              {maintenance.data.slice(0, 5).map(item => (
                <li
                  key={item.id}
                  className="p-3 border border-slate-200 rounded-md hover:bg-slate-50 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-900">{item.title}</div>
                      <div className="text-xs text-slate-500">Status: {item.status}</div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {item.priority || 'Normal'}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* RFP OVERVIEW */}
        <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-slate-900">RFP Overview</h2>
            <span className="text-xs text-slate-500">{rfps.data?.length || 0} total</span>
          </div>

          {rfps.data?.length === 0 ? (
            <p className="text-slate-500 text-sm">No RFPs available.</p>
          ) : (
            <ul className="space-y-2">
              {rfps.data.slice(0, 5).map(rfp => (
                <li
                  key={rfp.id}
                  className="p-3 border border-slate-200 rounded-md hover:bg-slate-50 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-900">{rfp.title}</div>
                      <div className="text-xs text-slate-500">Responses: {rfp.responses || 0}</div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {rfp.status || 'Open'}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function DashboardCard({ title, value, tone = 'neutral' }) {
  const toneClasses =
    tone === 'success'
      ? 'bg-emerald-50 text-emerald-700'
      : tone === 'warning'
        ? 'bg-amber-50 text-amber-700'
        : 'bg-slate-50 text-slate-700';

  return (
    <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col justify-between">
      <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">{title}</div>
      <div className="mt-3 flex items-baseline justify-between">
        <div className="text-3xl font-bold text-slate-900">{value}</div>
        <span className={`text-xs px-2 py-0.5 rounded-full ${toneClasses}`}>{title}</span>
      </div>
    </div>
  );
}
