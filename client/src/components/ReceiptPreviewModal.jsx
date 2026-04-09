import React from "react";

export default function ReceiptPreviewModal({ url, onClose }) {
  if (!url) return null;

  const isImage = /\.(png|jpe?g|gif)$/i.test(url);
  const isPDF = /\.pdf$/i.test(url);

  return (
    <div style={overlay}>
      <div style={box}>
        <div style={header}>
          <h3 style={{ margin: 0 }}>Receipt Preview</h3>
          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>

        <div style={content}>
          {isImage && (
            <img
              src={url}
              alt="Receipt"
              style={{ maxWidth: "100%", maxHeight: "70vh", borderRadius: "4px" }}
            />
          )}

          {isPDF && (
            <iframe
              title="Receipt PDF"
              src={url}
              style={{ width: "100%", height: "70vh", border: "none" }}
            />
          )}

          {!isImage && !isPDF && (
            <p>Preview not available. You can still download the file.</p>
          )}
        </div>

        <div style={footer}>
          <a href={url} target="_blank" rel="noreferrer" style={downloadLink}>
            Download
          </a>
          <button onClick={onClose} style={closeFooterBtn}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999
};

const box = {
  background: "white",
  borderRadius: "8px",
  padding: "16px",
  width: "80%",
  maxWidth: "800px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  display: "flex",
  flexDirection: "column",
  maxHeight: "90vh"
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "10px"
};

const closeBtn = {
  border: "none",
  background: "transparent",
  fontSize: "18px",
  cursor: "pointer"
};

const content = {
  flex: 1,
  overflow: "auto",
  marginBottom: "12px"
};

const footer = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const downloadLink = {
  padding: "8px 14px",
  background: "#1e3a8a",
  color: "white",
  borderRadius: "4px",
  textDecoration: "none"
};

const closeFooterBtn = {
  padding: "8px 14px",
  background: "#6b7280",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer"
};
