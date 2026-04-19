import React, { useState } from "react";
import useCommitteeMembers from "../hooks/useCommitteeMembers";

export default function CommitteeMembers() {
  const { members, addMember, updateMember, deleteMember } =
    useCommitteeMembers();

  const [form, setForm] = useState({ name: "", role: "", email: "", phone: "" });
  const [editingId, setEditingId] = useState(null);

  if (members.isLoading) return <div>Loading members…</div>;
  if (members.error) return <div>Error loading members.</div>;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateMember.mutate({ id: editingId, data: form });
    } else {
      addMember.mutate(form);
    }
    setForm({ name: "", role: "", email: "", phone: "" });
    setEditingId(null);
  };

  const startEdit = (m) => {
    setEditingId(m.id);
    setForm({
      name: m.name || "",
      role: m.role || "",
      email: m.email || "",
      phone: m.phone || ""
    });
  };

  return (
    <div>
      <h1>Committee Members</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Role"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <button type="submit">
          {editingId ? "Update Member" : "Add Member"}
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Email</th>
            <th>Phone</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {members.data.map((m) => (
            <tr key={m.id}>
              <td>{m.name}</td>
              <td>{m.role}</td>
              <td>{m.email}</td>
              <td>{m.phone}</td>
              <td>
                <button onClick={() => startEdit(m)}>Edit</button>
                <button onClick={() => deleteMember.mutate(m.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
