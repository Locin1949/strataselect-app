import { useQuery } from "@tanstack/react-query";

export default function useMaintenanceExtras() {
  return useQuery({
    queryKey: ["maintenance-extras"],
    queryFn: async () => {
      const res = await fetch("https://strataselect-app.onrender.com/api/maintenance/extras");
      if (!res.ok) throw new Error("Maintenance extras endpoint not implemented yet");
      return res.json();
    },
    enabled: false // prevents errors until backend route exists
  });
}
