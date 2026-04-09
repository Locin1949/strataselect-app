import React, { useState } from "react";
import Modal from "./Modal";
import { useTheme } from "../theme/ThemeContext";

import Input from "./forms/Input";
import Textarea from "./forms/Textarea";
import Select from "./forms/Select";
import FormRow from "./forms/FormRow";

import { useMaintenanceFiles, useMaintenanceAudit } from "../hooks/useMaintenanceExtras";

const STATUS_OPTIONS = ["New", "In Progress", "On Hold", "Completed"];
const PRIORITY_OPTIONS = ["Low", "Medium", "High", "Urgent"];

export default function MaintenanceModal({ onClose, editItem, add, update }) {
  const isEdit = !!editItem;
  const { theme } = useTheme();

  const [form, setForm] = useState(() => ({
    title: editItem?.title || "",
    description: editItem?.description || "",
    status: editItem?.status || "New",
    date: editItem?.date || "",
    unit: editItem?.unit || "",
    priority: editItem?.priority || "Medium",
    assigned_to: editItem?.assigned_to || "",
    scheme_id: editItem?.scheme_id || 1
  }));

  const { files, upload } = useMaintenanceFiles(editItem?.id);
  const { audit } = useMaintenanceAudit(editItem?.id);

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      update.mutate(
        { id: editItem.id, data: form },
        { onSuccess: () => onClose() }
      );
    } else {
      add.mutate(form, { onSuccess: () => onClose() });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && editItem?.id) upload.mutate(file);
  };

  const auditItems = audit?.data || [];

  return (
    <Modal
      title={isEdit ? "Edit Maintenance Request" : "Add Maintenance Request"}
      onClose={onClose}
      width={520}
    >
      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <Input
          label="Title"
          value={form.title}
          onChange={handleChange("title")}
          required
        />

        <Textarea
          label="Description"
          value={form.description}
          onChange={handleChange("description")}
        />

        <FormRow>
          <Select
            label="Status"
            value={form.status}
            onChange={handleChange("status")}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>

          <Select
            label="Priority"
            value={form.priority}
            onChange={handleChange("priority")}
          >
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </Select>
        </FormRow>

        <FormRow>
          <Input
            label="Date"
            type="date"
            value={form.date}
            onChange={handleChange("date")}
          />

          <Input
            label="Unit"
            value={form.unit}
            onChange={handleChange("unit")}
          />
        </FormRow>

        <Input
          label="Assigned To"
          value={form.assigned_to}
          onChange={handleChange("assigned_to")}
        />

        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <button type="submit" style={btn(theme)}>
            {isEdit ? "Save Changes" : "Create Request"}
          </button>

          <button type="button" onClick={onClose} style={btnSecondary(theme)}>
            Cancel
          </button>
        </div>
      </form>

      {/* ATTACHMENTS + AUDIT */}
      {isEdit && (
        <>
          <hr style={{ margin: "20px 0", borderColor: theme.border }} />

          <h3 style={{ marginBottom: 8 }}>Attachments</h3>
          <input type="file" onChange={handleFileChange} />

          <ul>
            {files?.data?.map((f) => (
              <li key={f.id}>
                <a
                  href={`/uploads/${f.filename}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {f.original_name || f.filename}
                </a>
              </li>
            ))}
          </ul>

          <h3 style={{ marginTop: 20, marginBottom: 8 }}>Activity</h3>
          <ul>
            {auditItems.map((a) => (
              <li key={a.id}>
                <strong>{a.action}</strong> at {a.created_at}
              </li>
            ))}
          </ul>
        </>
      )}
    </Modal>
  );
}

const btn = (theme) => ({
  padding: "8px 14px",
  background: theme.primary,
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 14
});

const btnSecondary = (theme) => ({
  padding: "8px 14px",
  background: theme.border,
  color: theme.text,
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 14
});
