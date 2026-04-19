import { useQuery } from "@tanstack/react-query";

export default function useMaintenance() {
  return useQuery({
    queryKey: ["maintenance"],
    queryFn: async () => {
      const res = await fetch("https://strataselect-app.onrender.com/api/maintenance");
      if (!res.ok) throw new Error("Maintenance endpoint not implemented yet");
      return res.json();
    },
    enabled: false
  });
}
