import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { registerToast } from "../utils/toastEmitter";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const show = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => removeToast(id), 4000);
  }, []);

  // ⭐ THIS is the correct place for useEffect
  useEffect(() => {
    registerToast(show);
  }, [show]);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}

      <div style={toastContainer}>
        {toasts.map((t) => (
          <div key={t.id} style={{ ...toast, ...toastType[t.type] }}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

const toastContainer = {
  position: "fixed",
  bottom: "20px",
  right: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  zIndex: 9999
};

const toast = {
  padding: "12px 18px",
  borderRadius: "6px",
  color: "white",
  fontSize: "14px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
};

const toastType = {
  info: { background: "#2563eb" },
  success: { background: "#16a34a" },
  error: { background: "#dc2626" }
};
