import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

const LIGHT = {
  name: "light",
  bg: "#f3f4f6",
  surface: "#ffffff",
  text: "#111827",
  textMuted: "#6b7280",
  primary: "#1e3a8a",
  primaryHover: "#274bb5",
  danger: "#dc2626",
  border: "#e5e7eb",
  shadow: "0 1px 3px rgba(0,0,0,0.08)"
};

const DARK = {
  name: "dark",
  bg: "#020617",
  surface: "#020617",
  text: "#e5e7eb",
  textMuted: "#9ca3af",
  primary: "#3b82f6",
  primaryHover: "#60a5fa",
  danger: "#f97373",
  border: "#1f2937",
  shadow: "0 1px 3px rgba(0,0,0,0.6)"
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(LIGHT);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") setTheme(DARK);
  }, []);

  useEffect(() => {
    document.body.style.background = theme.bg;
    document.body.style.color = theme.text;
    localStorage.setItem("theme", theme.name);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((t) => (t.name === "light" ? DARK : LIGHT));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
