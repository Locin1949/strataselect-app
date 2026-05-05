import React from 'react';

export default function LearningRuleTable({ title, data, onEdit, onDelete }) {
  const entries = Object.entries(data || {});

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      {entries.length === 0 ? (
        <p className="text-slate-500 text-sm">No rules learned yet.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b">
              <th className="py-2">Key</th>
              <th className="py-2">Category</th>
              <th className="py-2 w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([key, value]) => (
              <tr key={key} className="border-b">
                <td className="py-2">{key}</td>
                <td className="py-2">{value}</td>
                <td className="py-2 flex gap-2">
                  <button className="text-blue-600 underline" onClick={() => onEdit(key, value)}>
                    Edit
                  </button>
                  <button className="text-red-600 underline" onClick={() => onDelete(key)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
