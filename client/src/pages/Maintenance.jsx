import React, { useState } from "react";
import Card from "../components/Card";
import Table from "../components/Table";
import TableSkeleton from "../components/TableSkeleton";
import Pagination from "../components/Pagination";
import MaintenanceModal from "../components/MaintenanceModal";
import useMaintenance from "../hooks/useMaintenance";

export default function Maintenance() {
  const { list, add, update, remove } = useMaintenance();
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // Sorting
  const [sortField, setSortField] = useState("date");
  const [sortDir, setSortDir] = useState("asc");

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const items = list.data || [];

  // Loading
  if (list.isLoading)
    return (
      <div style={{ marginLeft: "240px", marginTop: "80px", padding: "20px" }}>
        <h1>Maintenance Requests</h1>
        <TableSkeleton rows={6} columns={8} />
      </div>
    );

  if (list.error)
    return (
      <div style={{ marginLeft: "240px", marginTop: "80px", padding: "20px" }}>
        <h1>Error loading maintenance data</h1>
      </div>
    );

  // Sorting logic
  const sortedItems = [...items].sort((a, b) => {
    const x = a[sortField];
    const y = b[sortField];

    if (x < y) return sortDir === "asc" ? -1 : 1;
    if (x > y) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedItems.length / pageSize);
  const paginatedItems = sortedItems.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Table columns
  const columns = [
    { key: "id", label: "ID", sortable: true },
    { key: "date", label: "Date", sortable: true },
    { key: "unit", label: "Unit", sortable: true },
    { key: "title", label: "Title", sortable: true },
    { key: "status", label: "Status", sortable: true },
    { key: "priority", label: "Priority", sortable: true },
    { key: "assigned_to", label: "Assigned To", sortable: true },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (_, row) => (
        <>
          <button
            style={{
              padding: "4px 8px",
              marginRight: "6px",
              background: "#1e3a8a",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
            onClick={() => {
              setEditItem(row);
              setModalOpen(true);
            }}
          >
            Edit
          </button>

          <button
            style={{
              padding: "4px 8px",
              background: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
            onClick={() => remove.mutate(row.id)}
          >
            Delete
          </button>
        </>
      )
    }
  ];

  return (
    <div style={{ marginLeft: "240px", marginTop: "80px", padding: "20px" }}>
      <h1>Maintenance Requests</h1>

      <Card
        title="Requests"
        actionButton={{
          label: "Add Request",
          onClick: () => {
            setEditItem(null);
            setModalOpen(true);
          }
        }}
      >
        <Table
          columns={columns}
          data={paginatedItems}
          sortField={sortField}
          sortDir={sortDir}
          onSort={(field, dir) => {
            setSortField(field);
            setSortDir(dir);
            setPage(1); // reset to page 1 when sorting
          }}
          emptyMessage="No maintenance requests found."
        />

        {/* PAGINATION */}
        {sortedItems.length > pageSize && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        )}
      </Card>

      {modalOpen && (
        <MaintenanceModal
          onClose={() => setModalOpen(false)}
          editItem={editItem}
          add={add}
          update={update}
        />
      )}
    </div>
  );
}
