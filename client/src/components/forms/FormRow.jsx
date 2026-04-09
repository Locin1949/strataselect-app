export default function FormRow({ children }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        width: "100%"
      }}
    >
      {children}
    </div>
  );
}
