export default function SkeletonText({ width = "100%" }) {
  return (
    <div
      style={{
        height: "14px",
        width,
        background: "#e5e7eb",
        borderRadius: "4px",
        animation: "pulse 1.4s infinite ease-in-out"
      }}
    />
  );
}
