import React from "react";

export default function StatGrid({ children, mode = "comfortable" }) {
  // spacing presets
  const spacing =
    mode === "compact"
      ? "12px"
      : mode === "wide"
      ? "32px"
      : "20px"; // comfortable (default)

  const minWidth =
    mode === "compact"
      ? "160px"
      : mode === "wide"
      ? "260px"
      : "220px"; // comfortable

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}, 1fr))`,
        gap: spacing,
        marginTop: spacing,
        alignItems: "stretch"
      }}
    >
      {children}
    </div>
  );
}
