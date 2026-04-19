import { useQuery } from "@tanstack/react-query";

export default function useMaintenanceFiles() {
  return useQuery({
    queryKey: ["maintenance-files"],
    queryFn: async () => {
      const res = await fetch("https://strataselect-app.onrender.com/api/maintenance/files");
      if (!res.ok) throw new Error("Maintenance files endpoint not implemented yet");
      return res.json();
    },
    enabled: false // prevents errors until backend route exists
  });
}
