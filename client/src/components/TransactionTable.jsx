import React, { useState } from "react";
import QuickAddRow from "./QuickAddRow";
import { CATEGORY_LIST } from "../data/categories";

import {
  HiPencil,
  HiDocumentDuplicate,
  HiTrash,
  HiPaperClip
} from "react-icons/hi2";
import ReceiptPreviewModal from "./ReceiptPreviewModal";

function getCategoryIcon(categoryName) {
  const match = CATEGORY_LIST.find((c) => c.name === categoryName);
  return match ? match.icon : "•";
}

function getFundStyle(fund) {
  if (fund === "Admin") {
    return { color: "#1e3a8a", fontWeight: 600 };
  }
  if (fund === "Sinking") {
    return { color: "#d97706", fontWeight: 600 };
  }
  return {};
}

export default function TransactionTable({
  data,
  onEdit,
  onDuplicate,
  onDelete,
  onAdd,
  sortField,
  sortDir,
  toggleSort
}) {
  const [previewUrl, setPreviewUrl] = useState(null);

  return (
    <>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#e5e7eb" }}>
            {["date", "category", "fund", "amount", "description"].map((field) => (
              <th key={field} style={th} onClick={() => toggleSort(field)}>
                {field.toUpperCase()}
                {sortField === field && (sortDir === "asc" ? " ▲" : " ▼")}
              </th>
            ))}
            <th style={th}>Receipt</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>

        <tbody>
          <QuickAddRow onAdd={onAdd} />

          {data.map((t) => (
            <tr key={t.id}>
              <td style={td}>{t.date}</td>

              <td style={td}>
                <span style={{ marginRight: "6px" }}>
                  {getCategoryIcon(t.category)}
                </span>
                {t.category}
              </td>

              <td style={{ ...td, ...getFundStyle(t.fund) }}>{t.fund}</td>
              <td style={td}>${t.amount}</td>
              <td style={td}>{t.description}</td>

              <td style={td}>
                {t.receipt_url && (
                  <button
                    style={iconBtn}
                    type="button"
                    onClick={() => setPreviewUrl(t.receipt_url)}
                    title="View receipt"
                  >
                    <HiPaperClip />
                  </button>
                )}
              </td>

              <td style={td}>
                <button style={btnSmall} onClick={() => onEdit(t)}>
                  <HiPencil />
                </button>

                <button style={btnSmall} onClick={() => onDuplicate(t)}>
                  <HiDocumentDuplicate />
                </button>

                <button
                  style={{ ...btnSmall, background: "#dc2626" }}
                  onClick={() => onDelete(t.id)}
                >
                  <HiTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {previewUrl && (
        <ReceiptPreviewModal
          url={previewUrl}
          onClose={() => setPreviewUrl(null)}
        />
      )}
    </>
  );
}

const th = {
  padding: "10px",
  textAlign: "left",
  borderBottom: "1px solid #ddd",
  cursor: "pointer"
};

const td = {
  padding: "8px",
  borderBottom: "1px solid #eee"
};

const btnSmall = {
  padding: "4px 8px",
  marginRight: "6px",
  background: "#1e3a8a",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer"
};

const iconBtn = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  fontSize: "16px",
  color: "#1e3a8a"
};
