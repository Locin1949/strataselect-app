import React, { useState } from 'react';

import { useRfps } from '@/hooks';
import { mutations } from '@/hooks';

export default function RfpPage() {
  const rfps = useRfps();

  const [selected, setSelected] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const createMutation = mutations.useCreateRfp();
  const updateMutation = mutations.useUpdateRfp(selected?.id);
  const deleteMutation = mutations.useDeleteRfp(selected?.id);

  if (rfps.isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">RFPs</h1>
        <p>Loading RFPs…</p>
      </div>
    );
  }

  if (rfps.isError) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">RFPs</h1>
        <p className="text-red-600">Unable to load RFPs.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Requests for Proposal</h1>
        <button
          onClick={() => {
            setSelected(null);
            setModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          + New RFP
        </button>
      </div>

      <RfpTable
        data={rfps.data}
        onEdit={item => {
          setSelected(item);
          setModalOpen(true);
        }}
        onDelete={item => {
          setSelected(item);
          deleteMutation.mutate(null);
        }}
      />

      {isModalOpen && (
        <RfpModal
          initial={selected}
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
function RfpTable({ data, onEdit, onDelete }) {
  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <table className="w-full">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">Title</th>
            <th className="p-3">Category</th>
            <th className="p-3">Status</th>
            <th className="p-3">Responses</th>
            <th className="p-3 w-32">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(rfp => (
            <tr key={rfp.id} className="border-t hover:bg-gray-50 transition">
              <td className="p-3">{rfp.title}</td>
              <td className="p-3">{rfp.category}</td>
              <td className="p-3">{rfp.status}</td>
              <td className="p-3">{rfp.responses || 0}</td>
              <td className="p-3 flex gap-2">
                <button
                  onClick={() => onEdit(rfp)}
                  className="px-2 py-1 text-sm bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(rfp)}
                  className="px-2 py-1 text-sm bg-red-600 text-white rounded"
                >
                  Del
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ============================
   MODAL COMPONENT
============================ */
function RfpModal({ initial, onClose, onSubmit }) {
  const [form, setForm] = useState(
    initial || {
      title: '',
      category: '',
      description: '',
      status: 'Open'
    }
  );

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg space-y-4">
        <h2 className="text-xl font-semibold">{initial ? 'Edit RFP' : 'New RFP'}</h2>

        <div className="space-y-3">
          <input
            className="w-full border p-2 rounded"
            placeholder="Title"
            value={form.title}
            onChange={e => update('title', e.target.value)}
          />

          <input
            className="w-full border p-2 rounded"
            placeholder="Category"
            value={form.category}
            onChange={e => update('category', e.target.value)}
          />

          <textarea
            className="w-full border p-2 rounded"
            placeholder="Description"
            value={form.description}
            onChange={e => update('description', e.target.value)}
          />

          <select
            className="w-full border p-2 rounded"
            value={form.status}
            onChange={e => update('status', e.target.value)}
          >
            <option>Open</option>
            <option>Closed</option>
            <option>Under Review</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={() => onSubmit(form)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {initial ? 'Save Changes' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}
