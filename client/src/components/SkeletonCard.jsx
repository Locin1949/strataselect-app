import SkeletonText from "./SkeletonText";

export default function SkeletonCard() {
  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
      }}
    >
      <SkeletonText width="40%" />
      <div style={{ marginTop: "10px" }}>
        <SkeletonText width="70%" />
      </div>
    </div>
  );
}
