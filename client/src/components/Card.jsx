import React from "react";

export default function Card({ title, children }) {
  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}
    >
      {title && (
        <h2 style={{ marginTop: 0, marginBottom: "15px", fontSize: "20px" }}>
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}