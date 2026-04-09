import React, { useState, useEffect, useRef } from "react";

export default function CategorySuggest({ value, onChange, suggestions, fund }) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const boxRef = useRef(null);

  const filtered = suggestions
    .filter((s) => s.fund === fund)
    .filter((s) => s.name.toLowerCase().includes(value.toLowerCase()));

  function handleKey(e) {
    if (!open) return;

    if (e.key === "ArrowDown") {
      setHighlight((h) => Math.min(h + 1, filtered.length - 1));
    }
    if (e.key === "ArrowUp") {
      setHighlight((h) => Math.max(h - 1, 0));
    }
    if (e.key === "Enter" && filtered[highlight]) {
      onChange(filtered[highlight].name);
      setOpen(false);
    }
  }

  useEffect(() => {
    function handleClick(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div style={{ position: "relative" }} ref={boxRef}>
      <input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onKeyDown={handleKey}
        style={input}
        placeholder="Category"
      />

      {open && filtered.length > 0 && (
        <div style={dropdown}>
          <div style={groupHeader}>{fund} Fund</div>

          {filtered.map((s, i) => (
            <div
              key={s.name}
              style={{
                ...item,
                background: i === highlight ? "#e5e7eb" : "white"
              }}
              onMouseDown={() => onChange(s.name)}
            >
              <span style={{ marginRight: "8px" }}>{s.icon}</span>
              {s.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const input = {
  width: "100%",
  padding: "8px",
  border: "1px solid #ccc",
  borderRadius: "4px"
};

const dropdown = {
  position: "absolute",
  top: "40px",
  left: 0,
  right: 0,
  background: "white",
  border: "1px solid #ccc",
  borderRadius: "4px",
  zIndex: 20,
  maxHeight: "200px",
  overflowY: "auto"
};

const item = {
  padding: "8px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center"
};

const groupHeader = {
  padding: "6px 8px",
  background: "#f3f4f6",
  fontWeight: "bold",
  fontSize: "12px",
  color: "#374151"
};
