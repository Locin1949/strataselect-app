import { useQuery } from "@tanstack/react-query";

export default function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await fetch("https://strataselect-app.onrender.com/health");
      if (!res.ok) throw new Error("Dashboard data unavailable");
      return res.json();
    }
  });
}
