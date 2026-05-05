// client/src/pages/MeetingsPage.jsx
import React, { useState } from 'react';

import { useMeetings } from '@/hooks';
import { mutations } from '@/hooks';

export default function MeetingsPage() {
  const meetings = useMeetings();
  const [selected, setSelected] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const createMutation = mutations.useCreateMeeting();
  const updateMutation = mutations.useUpdateMeeting(selected?.id);
  const deleteMutation = mutations.useDeleteMeeting(selected?.id);

  if (meetings.isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Meetings</h1>
        <p>Loading meetings…</p>
      </div>
    );
  }

  if (meetings.isError) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Meetings</h1>
        <p className="text-red-600">Unable to load meetings.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Meetings</h1>
        <button
          onClick={() => {
            setSelected(null);
            setModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          + New Meeting
        </button>
      </div>

      <MeetingsTable
        data={meetings.data}
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
        <MeetingModal
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

function MeetingsTable({ data, onEdit, onDelete }) {
  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <table className="w-full">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">Title</th>
            <th className="p-3">Date</th>
            <th className="p-3">Time</th>
            <th className="p-3">Location</th>
            <th className="p-3 w-32">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(m => (
            <tr key={m.id} className="border-t hover:bg-gray-50 transition">
              <td className="p-3">{m.title}</td>
              <td className="p-3">{m.date}</td>
              <td className="p-3">{m.time}</td>
              <td className="p-3">{m.location}</td>
              <td className="p-3 flex gap-2">
                <button
                  onClick={() => onEdit(m)}
                  className="px-2 py-1 text-sm bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(m)}
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

function MeetingModal({ initial, onClose, onSubmit }) {
  const [form, setForm] = useState(
    initial || {
      title: '',
      date: '',
      time: '',
      location: '',
      notes: ''
    }
  );

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg space-y-4">
        <h2 className="text-xl font-semibold">{initial ? 'Edit Meeting' : 'New Meeting'}</h2>

        <div className="space-y-3">
          <input
            className="w-full border p-2 rounded"
            placeholder="Title"
            value={form.title}
            onChange={e => update('title', e.target.value)}
          />

          <div className="flex gap-3">
            <input
              type="date"
              className="w-1/2 border p-2 rounded"
              value={form.date}
              onChange={e => update('date', e.target.value)}
            />
            <input
              type="time"
              className="w-1/2 border p-2 rounded"
              value={form.time}
              onChange={e => update('time', e.target.value)}
            />
          </div>

          <input
            className="w-full border p-2 rounded"
            placeholder="Location"
            value={form.location}
            onChange={e => update('location', e.target.value)}
          />

          <textarea
            className="w-full border p-2 rounded"
            placeholder="Notes"
            value={form.notes}
            onChange={e => update('notes', e.target.value)}
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
