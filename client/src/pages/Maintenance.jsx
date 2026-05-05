import React, { useState } from 'react';

import { useMaintenance, useMaintenanceExtras, useMaintenanceFiles } from '@/hooks';
import { mutations } from '@/hooks';

export default function MaintenancePage() {
  const maintenance = useMaintenance();
  const extras = useMaintenanceExtras();
  const files = useMaintenanceFiles();

  const [selected, setSelected] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const createMutation = mutations.useCreateMaintenance();
  const updateMutation = mutations.useUpdateMaintenance(selected?.id);
  const deleteMutation = mutations.useDeleteMaintenance(selected?.id);

  const isLoading = maintenance.isLoading || extras.isLoading || files.isLoading;

  const hasError = maintenance.isError || extras.isError || files.isError;

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Maintenance</h1>
        <p className="text-slate-600">Loading maintenance data…</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Maintenance</h1>
        <p className="text-red-600">Unable to load maintenance data. Please try again shortly.</p>
      </div>
    );
  }

  const requests = maintenance.data || [];
  const extrasData = extras.data || {};
  const filesData = files.data || [];

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Maintenance Requests</h1>
          <p className="text-slate-500 mt-1">
            Track, assign, and resolve maintenance issues across your portfolio.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex gap-3 text-xs text-slate-500">
            <span className="px-2 py-1 rounded-full bg-slate-100">{requests.length} requests</span>
            <span className="px-2 py-1 rounded-full bg-slate-100">{filesData.length} files</span>
            {'summary' in extrasData && (
              <span className="px-2 py-1 rounded-full bg-slate-100">{extrasData.summary}</span>
            )}
          </div>

          <button
            onClick={() => {
              setSelected(null);
              setModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition"
          >
            + New Request
          </button>
        </div>
      </div>

      {/* TABLE / EMPTY STATE */}
      {requests.length === 0 ? (
        <div className="border border-dashed border-slate-300 rounded-lg bg-slate-50 p-8 text-center">
          <h2 className="text-lg font-semibold text-slate-800">No maintenance requests yet</h2>
          <p className="text-slate-500 mt-2">
            Create your first maintenance request to start tracking issues and assignments.
          </p>
          <button
            onClick={() => {
              setSelected(null);
              setModalOpen(true);
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition"
          >
            Create Request
          </button>
        </div>
      ) : (
        <MaintenanceTable
          data={requests}
          onEdit={item => {
            setSelected(item);
            setModalOpen(true);
          }}
          onDelete={item => {
            setSelected(item);
            // selected is set just before; hook was created with selected?.id
            deleteMutation.mutate();
          }}
        />
      )}

      {/* MODAL */}
      {isModalOpen && (
        <MaintenanceModal
          initial={selected}
          extras={extrasData}
          onClose={() => setModalOpen(false)}
          onSubmit={form => {
            if (selected) {
              updateMutation.mutate(form);
            } else {
              createMutation.mutate(form);
            }
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

/* ============================
   TABLE COMPONENT
============================ */
function MaintenanceTable({ data, onEdit, onDelete }) {
  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-slate-600">
          <tr>
            <th className="p-3 font-semibold">Title</th>
            <th className="p-3 font-semibold">Status</th>
            <th className="p-3 font-semibold">Priority</th>
            <th className="p-3 font-semibold">Unit</th>
            <th className="p-3 font-semibold w-40">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id} className="border-t hover:bg-slate-50 transition-colors">
              <td className="p-3 text-slate-900">{item.title}</td>
              <td className="p-3">
                <StatusBadge status={item.status} />
              </td>
              <td className="p-3">
                <PriorityBadge priority={item.priority} />
              </td>
              <td className="p-3 text-slate-700">{item.unit}</td>
              <td className="p-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="px-2 py-1 text-xs bg-amber-500 text-white rounded hover:bg-amber-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ============================
   BADGE COMPONENTS
============================ */
function StatusBadge({ status }) {
  const base = 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium';
  if (status === 'Completed') {
    return <span className={`${base} bg-emerald-50 text-emerald-700`}>Completed</span>;
  }
  if (status === 'In Progress') {
    return <span className={`${base} bg-amber-50 text-amber-700`}>In Progress</span>;
  }
  return <span className={`${base} bg-slate-100 text-slate-700`}>Open</span>;
}

function PriorityBadge({ priority }) {
  const base = 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium';
  if (priority === 'High') {
    return <span className={`${base} bg-red-50 text-red-700`}>High</span>;
  }
  if (priority === 'Medium') {
    return <span className={`${base} bg-amber-50 text-amber-700`}>Medium</span>;
  }
  return <span className={`${base} bg-slate-100 text-slate-700`}>Low</span>;
}

/* ============================
   MODAL COMPONENT
============================ */
function MaintenanceModal({ initial, extras, onClose, onSubmit }) {
  const [form, setForm] = useState(
    initial || {
      title: '',
      description: '',
      status: 'Open',
      priority: 'Medium',
      unit: '',
      assigned_to: ''
    }
  );

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const units = extras?.units || [];
  const assignees = extras?.assignees || [];

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-xl space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">
          {initial ? 'Edit Request' : 'New Maintenance Request'}
        </h2>

        <div className="space-y-3">
          <input
            className="w-full border border-slate-300 p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Title"
            value={form.title}
            onChange={e => update('title', e.target.value)}
          />

          <textarea
            className="w-full border border-slate-300 p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Description"
            rows={3}
            value={form.description}
            onChange={e => update('description', e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              className="w-full border border-slate-300 p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.status}
              onChange={e => update('status', e.target.value)}
            >
              <option>Open</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>

            <select
              className="w-full border border-slate-300 p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.priority}
              onChange={e => update('priority', e.target.value)}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              className="w-full border border-slate-300 p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.unit}
              onChange={e => update('unit', e.target.value)}
            >
              <option value="">Select unit</option>
              {units.map(u => (
                <option key={u.id || u} value={u.name || u}>
                  {u.name || u}
                </option>
              ))}
            </select>

            <select
              className="w-full border border-slate-300 p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.assigned_to}
              onChange={e => update('assigned_to', e.target.value)}
            >
              <option value="">Assign to</option>
              {assignees.map(a => (
                <option key={a.id || a} value={a.name || a}>
                  {a.name || a}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded text-sm hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(form)}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition"
          >
            {initial ? 'Save Changes' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}
