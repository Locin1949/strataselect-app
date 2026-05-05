import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { useCommittee } from '@/hooks';
import { mutations } from '@/hooks';

export default function Committee() {
  const committee = useCommittee();

  const [selected, setSelected] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const addMutation = mutations.useAddCommitteeMember({
    onSuccess: () => toast.success('Member added'),
    onError: () => toast.error('Failed to add member')
  });

  const updateMutation = mutations.useUpdateCommitteeMember(selected?.id, {
    onSuccess: () => toast.success('Member updated'),
    onError: () => toast.error('Failed to update member')
  });

  const deleteMutation = mutations.useDeleteCommitteeMember(selected?.id, {
    onSuccess: () => toast.success('Member removed'),
    onError: () => toast.error('Failed to remove member')
  });

  if (committee.isLoading) return <div className="p-6">Loading committee…</div>;
  if (committee.isError) return <div className="p-6 text-red-600">Unable to load committee.</div>;

  const members = committee.data || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Committee Members</h1>
        <button
          onClick={() => {
            setSelected(null);
            setModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Add Member
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Lot</th>
            <th>Role</th>
            <th>Email</th>
            <th>Phone</th>
            <th className="w-32">Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map(m => (
            <tr key={m.id}>
              <td>{m.name}</td>
              <td>{m.lot}</td>
              <td>{m.role}</td>
              <td>{m.email}</td>
              <td>{m.phone}</td>
              <td className="flex gap-2">
                <button
                  className="px-2 py-1 text-sm bg-yellow-500 text-white rounded"
                  onClick={() => {
                    setSelected(m);
                    setModalOpen(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="px-2 py-1 text-sm bg-red-600 text-white rounded"
                  onClick={() => {
                    setSelected(m);
                    deleteMutation.mutate();
                  }}
                >
                  Del
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <MemberModal
          initial={selected}
          onClose={() => setModalOpen(false)}
          onSubmit={form => {
            if (selected) updateMutation.mutate(form);
            else addMutation.mutate(form);
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

function MemberModal({ initial, onClose, onSubmit }) {
  const [form, setForm] = useState(
    initial || {
      name: '',
      lot: '',
      role: '',
      email: '',
      phone: ''
    }
  );

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg space-y-4">
        <h2 className="text-xl font-semibold">{initial ? 'Edit Member' : 'New Member'}</h2>

        <div className="space-y-3">
          <input
            className="w-full border p-2 rounded"
            placeholder="Name"
            value={form.name}
            onChange={e => update('name', e.target.value)}
          />
          <input
            className="w-full border p-2 rounded"
            placeholder="Lot"
            value={form.lot}
            onChange={e => update('lot', e.target.value)}
          />
          <input
            className="w-full border p-2 rounded"
            placeholder="Role"
            value={form.role}
            onChange={e => update('role', e.target.value)}
          />
          <input
            className="w-full border p-2 rounded"
            placeholder="Email"
            value={form.email}
            onChange={e => update('email', e.target.value)}
          />
          <input
            className="w-full border p-2 rounded"
            placeholder="Phone"
            value={form.phone}
            onChange={e => update('phone', e.target.value)}
          />
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
