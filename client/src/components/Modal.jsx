import React, { useEffect } from "react";
import { useTheme } from "../theme/ThemeContext";

export default function Modal({ title, children, onClose, width = 480 }) {
  const { theme } = useTheme();

  // Close on ESC
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        animation: "fadeIn 0.2s ease"
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width,
          background: theme.surface,
          color: theme.text,
          borderRadius: 10,
          padding: "24px",
          boxShadow: theme.shadow,
          border: `1px solid ${theme.border}`,
          animation: "scaleIn 0.2s ease"
        }}
      >
        {title && (
          <h2
            style={{
              marginTop: 0,
              marginBottom: "16px",
              fontSize: "20px",
              color: theme.primary
            }}
          >
            {title}
          </h2>
        )}

        {children}
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0 }
            to { opacity: 1 }
          }
          @keyframes scaleIn {
            from { transform: scale(0.95); opacity: 0 }
            to { transform: scale(1); opacity: 1 }
          }
        `}
      </style>
    </div>
  );
}
